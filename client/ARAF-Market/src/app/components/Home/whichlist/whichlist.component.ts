import { Component } from '@angular/core';
import { WishlistService } from '../../../services/DATA/WhichList/whichlist.service';
import { ProductService } from '../../../services/API/product.service';
import { CurrencyPipe, NgForOf, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LoadingComponent } from "../../others/loading/loading.component";

@Component({
  selector: 'app-whichlist',
  imports: [NgIf, NgForOf, CurrencyPipe, RouterLink, LoadingComponent],
  templateUrl: './whichlist.component.html',
  styleUrl: './whichlist.component.css'
})
export class WhichlistComponent {
  wishlistItems: any[] = [];

  isLoading: boolean = true;
  constructor(
    private wishlistService: WishlistService,
    private productService: ProductService
  ) {
    this.loadWishlist();
  }

  loadWishlist() {
    const wishlistIds = this.wishlistService.getWishlist();
    this.productService.getProductsByIds(wishlistIds).subscribe({
      next: (data) => {
        this.wishlistItems = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading wishlist:', err);
        this.isLoading = false;
      }
    });
  
  }

  removeFromWishlist(productId: string) {
    this.wishlistService.removeFromWishlist(productId);
    this.loadWishlist();
  }
}
