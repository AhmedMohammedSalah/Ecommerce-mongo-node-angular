import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { CartService } from '../../../services/API/cart.service';
import { AuthServiceService } from '../../../services/DATA/auth-service.service';

@Component({
  selector: 'app-cart',
  imports: [NgIf,NgFor,CurrencyPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent {
  cartItems: any[] = [];
  loading = true;

  constructor(
    public cartService: CartService,
    public authService: AuthServiceService
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart() {
    this.cartService.getCart().subscribe({
      next: (response: any) => {
        this.cartItems = response.items;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading cart:', err);
        this.loading = false;
      }
    });
  }

  updateQuantity(item: any, newQuantity: number) {
    if (newQuantity > 0 && newQuantity <= item.stockQuantity) {
      this.cartService.updateQuantity(item.productId, newQuantity).subscribe({
        next: () => {
          item.quantity = newQuantity;
        },
        error: (err) => console.error('Update failed:', err)
      });
    }
  }

  removeItem(productId: string) {
    this.cartService.removeFromCart(productId).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter(item => item.productId !== productId);
      },
      error: (err) => console.error('Remove failed:', err)
    });
  }
}

