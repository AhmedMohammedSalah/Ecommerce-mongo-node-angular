import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthServiceService } from '../../../services/DATA/auth-service.service';

@Component({
  selector: 'app-header',
  imports: [NgbDropdownModule,RouterLink,NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isLoggedIn: boolean = false;

  constructor(private authService: AuthServiceService) {}

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
      console.log('Login status updated:', this.isLoggedIn);
    });
  }
  logout() {
    this.authService.logout();
  }

}
