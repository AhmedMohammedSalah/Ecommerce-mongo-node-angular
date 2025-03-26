import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthServiceService } from '../../../services/DATA/auth-service.service';
import { CartService } from '../../../services/API/cart.service';

@Component({
  selector: 'app-header',
  imports: [NgbDropdownModule, RouterLink, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  isLoggedIn: boolean = false;
  cartCount: number = 0;
  constructor(
    private authService: AuthServiceService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
      console.log('Login status updated:', this.isLoggedIn);
    });
    this.cartService.getCartItemsLength().subscribe((count) => {
      this.cartCount = count;
    });
    this.cartService.cartCount$.subscribe((count) => {
      this.cartCount = count;
    });
  }
  logout() {
    this.authService.logout();
  }
}
