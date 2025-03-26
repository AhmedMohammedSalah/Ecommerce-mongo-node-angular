import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin-orders.service';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css'],
})
export class AdminOrdersComponent implements OnInit {
  orders: any[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.fetchOrders();
  }

  fetchOrders() {
    this.adminService.getAllOrders().subscribe(
      (data: any) => {
        this.orders = data;
      },
      (error) => {
        console.error('Error fetching orders:', error);
      }
    );
  }

  updateStatus(orderId: string, newStatus: string) {
    this.adminService.updateOrderStatus(orderId, newStatus).subscribe(
      (response) => {
        console.log('Order updated:', response);
        this.fetchOrders(); // Refresh order list after update
      },
      (error) => {
        console.error('Error updating order:', error);
      }
    );
  }
}
