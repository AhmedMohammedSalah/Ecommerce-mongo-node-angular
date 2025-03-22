import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthServiceService } from '../DATA/auth-service.service';


@Injectable({
  providedIn: 'root'
})
export class CartService {
  private sessionId: string;

  constructor(
    private http: HttpClient,
    private authService: AuthServiceService
  ) {
    this.sessionId = localStorage.getItem('guestSessionId') || this.generateSessionId();
  }

  generateSessionId(): string {
    const id = 'guest_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('guestSessionId', id);
    return id;
  }

  addToCart(productId: string) {
    const payload = {
      sessionId: this.authService.isLoggedIn$ ? null : this.sessionId,
      productId
    };
    
    return this.http.post('http://127.0.0.1:3000/addtocart', payload);
  }

  removeFromCart(productId: string) {
    const payload = {
      sessionId: this.authService.isLoggedIn$ ? null : this.sessionId,
      productId
    };
    
    return this.http.post('http://127.0.0.1:3000/removefromcart', payload);
  }

  updateQuantity(productId: string, quantity: number) {
    return this.http.put('http://127.0.0.1:3000/cart/', {
      productId,
      quantity
    });
  }

  getCart() {
    if (this.authService.isLoggedIn$) {
      return this.http.get('http://127.0.0.1:3000/cart/');
    }
    return this.http.get(`http://127.0.0.1:3000/cart/${this.sessionId}`);
  }

  syncGuestCart(userId: string) {
    return this.http.post('http://127.0.0.1:3000/synccart', {
      sessionId: this.sessionId,
      userId
    });
  }
}