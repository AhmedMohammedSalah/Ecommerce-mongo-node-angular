import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../../services/API/order.service';


import { CurrencyPipe, DatePipe, NgFor, NgIf, SlicePipe, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from "../../header/header.component";
import { FooterComponent } from "../../footer/footer.component";

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    RouterLink,
    SlicePipe,
    CurrencyPipe,
    TitleCasePipe,
    DatePipe,
    HeaderComponent,
    FooterComponent
],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css',
})
export class OrderComponent implements OnInit {
  orders: any[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe({
      next: (data: any) => {
        this.orders = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load orders. Please try again later.';
        this.isLoading = false;
        console.error('Error loading orders:', err);
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
}
