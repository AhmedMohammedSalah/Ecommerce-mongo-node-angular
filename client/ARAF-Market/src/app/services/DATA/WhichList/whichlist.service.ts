import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly STORAGE_KEY = 'wishlist';

  getWishlist(): string[] {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
  }

  addToWishlist(productId: string): void {
    const wishlist = this.getWishlist();
    if (!wishlist.includes(productId)) {
      wishlist.push(productId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(wishlist));
    }
  }

  removeFromWishlist(productId: string): void {
    const wishlist = this.getWishlist().filter(id => id !== productId);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(wishlist));
  }
}