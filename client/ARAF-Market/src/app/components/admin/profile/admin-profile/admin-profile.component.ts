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
    this.router.navigate(['/admin/allusers']);  
  }

  navigateToCustomers() {
    this.router.navigate(['/admin/allsellers']);  
  }
}
