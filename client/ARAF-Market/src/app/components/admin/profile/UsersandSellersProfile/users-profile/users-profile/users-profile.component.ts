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
  customers: any[] = [];
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getAllCustomers();
  }

  getAllCustomers() {
    this.http.get<any[]>('http://127.0.0.1:3000/all-customers')
      .subscribe(
        (response) => {
          this.customers = response.filter(user => user.role === 'customer');
        },
        (error) => {
          this.errorMessage = 'Error fetching customers!';
        }
      );
  }

  toggleBlock(customer: any) {
    const newStatus = !customer.isBlocked;
    
    this.http.put(`http://127.0.0.1:3000/block-customer/${customer._id}`, { isBlocked: newStatus })
      .subscribe(
        () => {
          customer.isBlocked = newStatus;
        },
        (error) => {
          console.error('Error updating customer status');
        }
      );
  }
}
