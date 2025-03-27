import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../../services/API/order.service';
import { ActivatedRoute } from '@angular/router';
import { SlicePipe,CurrencyPipe, DatePipe, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { ProductService } from '../../../../services/API/product.service';
import { HeaderComponent } from "../../header/header.component";
import { FooterComponent } from "../../footer/footer.component";

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [SlicePipe, CurrencyPipe, TitleCasePipe, DatePipe, NgFor, NgIf, HeaderComponent, FooterComponent],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css',
})
export class OrderDetailComponent implements OnInit {
  order: any = null;
  isLoading = true;
  error: string | null = null;

  cartItems: any[] = [];
  productsIds: any[] = [];
  products: any[] = [];

  private destroy$ = new Subject<void>();
  constructor(
    private orderService: OrderService,

    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.loadOrderDetails(orderId);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadOrderDetails(orderId: string): void {
    this.orderService.getOrderById(orderId).subscribe({
      next: (data: any) => {
        this.order = data;
        this.isLoading = false;
        this.cartItems = data.items;

        this.loadProducts();
      },
      error: (err) => {
        this.error = 'Failed to load order details.';
        this.isLoading = false;
        console.error('Error loading order details:', err);
      },
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-warning';
      case 'completed':
        return 'bg-success';
      case 'cancelled':
        return 'bg-danger';
      case 'shipped':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
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
