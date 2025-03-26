

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users-profile.component.html',
  styleUrl: './users-profile.component.css'
})
export class UsersProfileComponent implements OnInit {
  users: any[] = [];
  errorMessage: string = '';
  successMessage: string = '';
  
  private apiUrl = 'http://127.0.0.1:3000';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getAllUsers();
  }

  getAllUsers() {
    this.http.get<any[]>(`${this.apiUrl}/all-customers`)
      .subscribe(
        (response) => {
          console.log('Raw Response:', response); 
          this.users = response
            .map(user => ({
              id: user._id?._id ?? 'Unknown',
              name: user._id?.name ?? 'Unknown',
              email: user._id?.email ?? 'Unknown',
              role: user._id?.role ?? 'Unknown',



            isBlocked: user.isDeleted ?? false 
          }))
          .filter(user => user.role === "user");
  
          console.log('Formatted Users:', this.users); 
        },
        (error) => {
          this.errorMessage = 'Error fetching users!';
          console.error('Error fetching users:', error);
        }
      );
  }
  
  toggleBlock(user: any) {
    console.log('User Before Toggle:', user);
    const newStatus = !user.isBlocked;
    const userId = user.id;
    
    if (!userId) {
      this.errorMessage = '⚠️ User ID is missing!';
      return;
    }

    if (newStatus) {
      this.http.delete(`${this.apiUrl}/users/${userId}`)
        .subscribe(
          (response: any) => {
            console.log(response.message);
            user.isBlocked = newStatus;
            this.successMessage = `✅ User ${user.name} has been blocked.`;
            setTimeout(() => { this.successMessage = ''; }, 3000);
          },
          (error) => {
            console.error('❌ Error updating user status:', error);
            this.errorMessage = '❌ Failed to update user status. Please try again!';
            setTimeout(() => { this.errorMessage = ''; }, 3000);
          }
        );
    } else {
      this.http.put(`${this.apiUrl}/user/restore/${userId}`, {})
        .subscribe(
          (response: any) => {
            console.log(response.message);
            user.isBlocked = newStatus;
            this.successMessage = `✅ User ${user.name} has been restored.`;
            setTimeout(() => { this.successMessage = ''; }, 3000);
          },
          (error) => {
            console.error('❌ Error updating user status:', error);
            this.errorMessage = '❌ Failed to update user status. Please try again!';
            setTimeout(() => { this.errorMessage = ''; }, 3000);
          }
        );
    }
  }
}
