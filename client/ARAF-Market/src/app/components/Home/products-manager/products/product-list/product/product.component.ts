import { CommonModule, NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../../../../services/API/cart.service';
import { WishlistService } from '../../../../../../services/DATA/WhichList/whichlist.service';
import { AuthServiceService } from '../../../../../../services/DATA/auth-service.service';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [RouterLink, NgClass,CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {
  @Input() product: any;
  wishlist: string[] = []
  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService,
    private authService: AuthServiceService,

    private snackBar: MatSnackBar
  ) { }
  ngOnInit() {
    this.wishlist = this.wishlistService.getWishlist();
  }
  isInWishlist(productId: string): boolean {
    return this.wishlist.includes(productId);
  }
  // Method to add product to cart
  addToCart(product: any) {

    // Call the cart service to add the product
    this.cartService.addToCart((product._id)).subscribe({
      next: (response) => {
        console.log('Product added to cart:', response);
        // Optionally, update the UI or show a success message
        this.showSnackbar('Product added to cart!', 'success');
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
        // Optionally, show an error message
        this.showSnackbar('Failed to add product to cart. Please try again.', 'error');
      }
    });
  }
  // Method to add product to wishlist
  addToWhichlist(product: any) {
    // Check if the product is already in the wishlist
    const wishlist = this.wishlistService.getWishlist();
    if (wishlist.includes(product._id)) {
      // If the product is already in the wishlist, remove it
      this.wishlistService.removeFromWishlist(product._id);
      console.log('Product removed from wishlist');
      this.showSnackbar('Product removed from wishlist!', 'success');
    } else {
      // If the product is not in the wishlist, add it
      this.wishlistService.addToWishlist(product._id);
      console.log('Product added to wishlist');
      this.showSnackbar('Product added to wishlist!', 'success');
    }

    // Optionally, update the UI or show a message
  }


  // Helper method to show snackbar notifications
  private showSnackbar(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Close', {
      duration: 3000, // Duration in milliseconds
      panelClass: type === 'success' ? 'snackbar-success' : 'snackbar-error'
    });
  }
}
