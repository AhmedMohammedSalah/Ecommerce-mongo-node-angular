import { Component } from '@angular/core';
import { UserServicesService } from '../../../../../../services/API/users/user.service';
import { Users } from '../../../../../../types/users.interface';
import { OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-users-profile',
  imports: [],
  templateUrl: './users-profile.component.html',
  styleUrl: './users-profile.component.css'
})
export class UsersProfileComponent implements OnInit  {
  users: any[] = [];
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getAllUsers();
  }

  getAllUsers() {
    this.http.get<any[]>('http://127.0.0.1:3000/all-users')
      .subscribe(
        (response) => {
          this.users = response; 
        },
        (error) => {
          this.errorMessage = 'Error fetching users!';
        }
      );
  }

  toggleBlock(user: any) {
    const newStatus = !user.isBlocked;
    
    this.http.put(`http://127.0.0.1:3000/block-user/${user._id}`, { isBlocked: newStatus })
      .subscribe(
        () => {
          user.isBlocked = newStatus;
        },
        (error) => {
          console.error('Error updating user status');
        }
      );
  }
}
