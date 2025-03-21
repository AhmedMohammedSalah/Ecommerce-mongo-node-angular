import { Component } from '@angular/core';
import { UserServicesService } from '../../../../../../services/API/users/user.service';
import { Users } from '../../../../../../types/users.interface';

@Component({
  selector: 'app-users-profile',
  imports: [],
  templateUrl: './users-profile.component.html',
  styleUrl: './users-profile.component.css'
})
export class UsersProfileComponent {
  users: Users[] = []; 
  errorMessage: string = '';

  constructor(private userService: UserServicesService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        this.errorMessage = 'Failed to load users. Please try again.';
      }
    });
  }
}
