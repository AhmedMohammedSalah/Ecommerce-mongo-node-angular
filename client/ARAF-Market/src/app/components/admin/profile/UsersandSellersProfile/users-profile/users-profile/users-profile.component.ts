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


  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getAllUsers();
  }

  
  
  
  getAllUsers() {
    this.http.get<any[]>('http://127.0.0.1:3000/all-customers')
      .subscribe(
        (response) => {
          console.log('Raw Response:', response); 
  
          this.users = response
            .map(user => ({
              id: user._id?._id ?? 'Unknown',
              name: user._id?.name ?? 'Unknown',
              email: user._id?.email ?? 'Unknown',
              role: user._id?.role ?? 'Unknown',
              isBlocked: user.isBlocked ?? false 
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
    const userId = user.id || user._id;

    if (!userId) {
      this.errorMessage = '⚠️ User ID is missing!';
      return;
    }

    this.http.put(`http://127.0.0.1:3000/block-user/${userId}`, { isBlocked: newStatus })
      .subscribe(
        () => {
          console.log(`User ${user.name} is now ${newStatus ? 'Blocked' : 'Unblocked'}`);
          user.isBlocked = newStatus; 
          this.successMessage = `✅ User ${user.name} is now ${newStatus ? 'Blocked' : 'Unblocked'}`;
          
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        (error) => {
          console.error('❌ Error updating user status:', error);
          this.errorMessage = '❌ Failed to update user status. Please try again!';
          
          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
        }
      );
  }
  
}
