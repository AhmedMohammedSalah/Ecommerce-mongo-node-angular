import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { CartService } from '../../../services/API/cart.service';
import { AuthServiceService } from '../../../services/DATA/auth-service.service';
import { ProductService } from '../../../services/API/product.service';
import { CartItemComponent } from './cart-item/cart-item.component';
import { Subject, takeUntil } from 'rxjs';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-cart',
  imports: [NgIf, NgFor, CurrencyPipe, CartItemComponent, HeaderComponent, FooterComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  cartItems: any[] = [];
  loading = true;
  productsIds: any[] = [];
  products: any[] = [];

  private destroy$ = new Subject<void>();
  constructor(
    public cartService: CartService,
    public authService: AuthServiceService,
    public productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCart(): void {
    this.cartService
      .getCart()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.cartItems = response.items;
          this.loadProducts();
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading cart:', err);
          this.loading = false;
        },
      });
  }

  private loadProducts(): void {
    if (!this.cartItems.length) return;

    const productIds = this.cartItems.map((item) => item.productId);

    this.productService
      .getProductsByIds(productIds)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (products: any[]) => {
          this.products = products;
        },
        error: (err) => {
          console.error('Error loading cart products:', err);
        },
      });
  }

  getProduct(productId: string): any | undefined {
    return this.products.find((prod) => prod._id === productId);
  }

  handleItemRemoved(productId: string): void {
    this.cartItems = this.cartItems.filter(
      (item) => item.productId !== productId
    );
    this.products = this.products.filter((prod) => prod._id !== productId);
  }
  calculateTotal(): number {
    if (!this.cartItems.length) return 0;

    return this.cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  }
  calculateSubtotal(): number {
    return this.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }
}
