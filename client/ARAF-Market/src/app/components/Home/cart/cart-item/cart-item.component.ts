import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartService } from '../../../../services/API/cart.service';
import { AuthServiceService } from '../../../../services/DATA/auth-service.service';
import { ProductService } from '../../../../services/API/product.service';
import { CurrencyPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-cart-item',
  imports: [NgIf,CurrencyPipe],
  templateUrl: './cart-item.component.html',
  styleUrl: './cart-item.component.css',
})
export class CartItemComponent {
  @Input() product: any;
  @Input() item: any;
  @Output() itemRemoved = new EventEmitter<string>();

  constructor(public cartService: CartService) {}

  updateQuantity(newQuantity: number): void {
    if (newQuantity > 0 && newQuantity <= this.product.stockQuantity) {
      console.log('updateQuantity');

      this.cartService
        .updateQuantity(this.item.productId, newQuantity)
        .subscribe({
          next: () => {
            this.item.quantity = newQuantity;
          },
          error: (err) => console.error('Update failed:', err),
        });
    }
  }

  removeItem(): void {
    this.cartService.removeFromCart(this.item.productId).subscribe({
      next: () => {
        this.itemRemoved.emit(this.item.productId);
      },
      error: (err) => console.error('Remove failed:', err),
    });
  }
  calculateDiscountPercentage(): number {
    if (
      !this.product?.originalPrice ||
      this.product.originalPrice <= this.product.price
    ) {
      return 0;
    }
    return Math.round(
      ((this.product.originalPrice - this.product.price) /
        this.product.originalPrice) *
        100
    );
  }
}
