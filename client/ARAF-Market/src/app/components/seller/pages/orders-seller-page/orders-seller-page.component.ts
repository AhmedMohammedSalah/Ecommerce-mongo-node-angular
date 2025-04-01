import { Component, inject } from '@angular/core';
import { SellerProfileService } from '../../../../services/API/seller-profile/seller-profile.service';
import { ProfileService } from '../../../../services/API/customer-profile/customer-profile.service';
import { ProductService } from '../../../../services/API/product.service';
import { CategoryService } from '../../../../services/API/category/category.service';
import { OrderService } from '../../../../services/API/order.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-orders-seller-page',
  imports: [RouterLink],
  templateUrl: './orders-seller-page.component.html',
  styleUrl: './orders-seller-page.component.css'
})

export class OrdersSellerPageComponent {

  //=ATTRIBUTES======= 
  orders: any[] = [];
  isLoading = true;
  error: string | null = null;

  //=SERVICE========================================
  sellerService = inject(SellerProfileService);


  //=NOINIT=========
  ngOnInit(): void {
    this.loadOrders();
  }


  //=METHODS==========
  loadOrders(): void {
    this.sellerService.getSellerData().subscribe({
      next: (data: any) => {
        this.orders = data.orders;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load orders.';
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


// get the name and email of the customer to be view on the order
// get the product info to be used in the order