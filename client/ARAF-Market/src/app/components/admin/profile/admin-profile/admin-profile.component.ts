import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin-profile',
  imports: [],
  templateUrl: './admin-profile.component.html',
  styleUrl: './admin-profile.component.css'
})
export class AdminProfileComponent {
  constructor(private router: Router) {}

  navigateToUsers() {
    this.router.navigate(['/users']);  
  }

  navigateToCustomers() {
    this.router.navigate(['/sellers']);  
  }
}
