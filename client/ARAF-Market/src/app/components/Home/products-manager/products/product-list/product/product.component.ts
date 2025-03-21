import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product',
  imports: [RouterLink, CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  @Input() product: any;

  // Method to add product to cart
  addToCart(product: any) {
    // Your logic here, e.g., call a cart service
    console.log('Adding to cart:', product);
    // cartService.addToCart(product);
  }

  // Method to add product to wishlist
  addToWishList(product: any) {
    // Your logic here, e.g., call a wishlist service
    console.log('Adding to wishlist:', product);
    // wishlistService.addToWishlist(product);
  }
}
