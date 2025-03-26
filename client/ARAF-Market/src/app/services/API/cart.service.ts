import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthServiceService } from '../DATA/auth-service.service';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: any[] = [];
  private sessionId: string;
  private isLoggedIn: boolean = false;

  private cartCountSubject = new BehaviorSubject<number>(0);
  public cartCount$ = this.cartCountSubject.asObservable();
  constructor(
    private http: HttpClient,
    private authService: AuthServiceService
  ) {
    this.sessionId =
      localStorage.getItem('guestSessionId') || this.generateSessionId();
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
  }

  generateSessionId(): string {
    const id = 'guest_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('guestSessionId', id);
    return id;
  }

  addToCart(productId: string): Observable<any> {
    console.log(productId);

    const endpoint = 'http://127.0.0.1:3000/addtocart';
    const body = this.isLoggedIn
      ? { productId }
      : { productId, sessionId: this.sessionId };
    console.log(this.authService.isLoggedIn$.subscribe((res) => res));

    console.log(body);

    return this.http
      .post(endpoint, body)
      .pipe(switchMap(() => this.getCartItemsLength()));
  }
  removeFromCart(productId: string): Observable<any> {
    const endpoint = 'http://127.0.0.1:3000/removefromcart';
    const payload = this.isLoggedIn
      ? { productId }
      : { productId, sessionId: this.sessionId };

    return this.http
      .post(endpoint, payload)
      .pipe(
        catchError((error) => {
          console.error('Error removing from cart:', error);
          return throwError(() => new Error('Failed to remove item from cart'));
        })
      )
      .pipe(switchMap(() => this.getCartItemsLength()));
  }
  updateQuantity(productId: string, quantity: number) {
    if (this.isLoggedIn)
      return this.http.put('http://127.0.0.1:3000/cart/', {
        productId,
        quantity,
      });
    else
      return this.http.put('http://127.0.0.1:3000/cart/', {
        sessionId: this.sessionId,
        productId,
        quantity,
      });
  }

  getCart(): Observable<any> {
    if (this.isLoggedIn) {
      return this.http.get('http://127.0.0.1:3000/cart/');
    }
    console.log(this.sessionId);

    return this.http.get(
      `http://127.0.0.1:3000/cart/session/${this.sessionId}`
    );
  }
  getCartItemsLength(): Observable<number> {
    return this.getCart().pipe(
      map((response) => response?.items?.length || 0),
      tap((count) => this.cartCountSubject.next(count)),
      catchError(() => of(this.cartCountSubject.value))
    );
  }

  syncGuestCart():void {
    if (!this.sessionId) {
       throwError(() => new Error('No session ID available'));
    }

    if (!this.isLoggedIn) {
       throwError(() => new Error('User must be logged in to sync cart'));
    }
    console.log("before send request ");
    
    this.http.post("http://127.0.0.1:3000/cart/synccart", {
      sessionId: this.sessionId,
    });
    // .pipe(
    //   switchMap(() => this.refreshCartData()),
    //   catchError((error) => {
    //     console.error('Sync failed:', error);
    //     if (error.error?.message?.includes('duplicate key error')) {
    //       return throwError(
    //         () =>
    //           new Error('Cart synchronization conflict. Please try again.')
    //       );
    //     }
    //     return throwError(() => new Error('Failed to sync cart'));
    //   })
    // );
  }
  private refreshCartData(): Observable<void> {
    return this.getCart().pipe(
      tap((cart) => {
        this.cartItems = cart.items;
        this.cartCountSubject.next(cart.items.length);
      }),
      map(() => undefined)
    );
  }
}
