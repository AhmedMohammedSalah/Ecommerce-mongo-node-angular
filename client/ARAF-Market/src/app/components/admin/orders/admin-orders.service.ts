import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AdminService {

  private apiUrl = 'http://127.0.0.1:3000'; // Change to your backend URL

  constructor(private http: HttpClient) {}

  // Fetch all orders
  getAllOrders() {
    return this.http.get(`${this.apiUrl}/orders/admin`);
  }

  // Update order status
  updateOrderStatus(orderId: string, newStatus: string) {
    return this.http.put(`${this.apiUrl}/orders/seller/update`, {
      orderId,
      newStatus,
    });
  }
}
