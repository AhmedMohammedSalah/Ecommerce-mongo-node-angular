import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../../../services/API/cart.service';
import { OrderService } from '../../../../services/API/order.service';
import { PaymentService } from '../../../../services/API/payment.service';
import { AuthServiceService } from '../../../../services/DATA/auth-service.service';
import { FooterComponent } from '../../footer/footer.component';
import { HeaderComponent } from '../../header/header.component';
import { CurrencyPipe, NgFor, NgForOf, NgIf } from '@angular/common';
import { Order, PaymentResponse } from '../../../../interfaces/interfaces';
import { Subject, takeUntil } from 'rxjs';
import { ProductService } from '../../../../services/API/product.service';

@Component({
  selector: 'app-checkout',
  imports: [
    NgForOf,
    NgFor,
    NgIf,
    RouterLink,
    FooterComponent,
    HeaderComponent,
    ReactiveFormsModule,
    CurrencyPipe,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
// checkout.component.ts
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  paypal: any;
  cartItems: any[] = [];
  productsIds: any[] = [];
  products: any[] = [];

  loading: boolean = false;
  orderError: string = '';
  orderSuccess: string = '';
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private paymentService: PaymentService,
    private authService: AuthServiceService,
    private router: Router,
    private productService: ProductService
  ) {
    this.checkoutForm = this.fb.group({
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required],
      country: ['', Validators.required],
      paymentMethod: ['PayPal', Validators.required],
    });
  }

  async ngOnInit() {
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
        },
        error: (err) => {
          console.error('Error loading cart:', err);
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
    this.orderService.setAllPrice(this.calculateTotal());
  }

  getProduct(productId: string): any | undefined {
    return this.products.find((prod) => prod._id === productId);
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
  placeOrder() {
    if (this.checkoutForm.invalid) return;

    const orderData = {
      shippingAddress: {
        street: "el3almya st ",
        city: this.checkoutForm.value.city,
        state: this.checkoutForm.value.state,
        zipCode: this.checkoutForm.value.zip,
        country: this.checkoutForm.value.country,
      },
      paymentMethod: this.checkoutForm.value.paymentMethod,
    };
      this.orderService.createOrder(orderData).subscribe({
        next: (response: any) => {
          this.loading = false;
          this.orderSuccess = response.msg || 'Order created successfully';
          // Optionally store order details in a shared service or navigate to payment
          this.router.navigate(['/payment'], {
            state: { order: response.order },
          });
        },
        error: (err) => {
          this.loading = false;
          this.orderError = 'Failed to create order. Please try again.';
          console.error(err);
        },
      });
  }
}
