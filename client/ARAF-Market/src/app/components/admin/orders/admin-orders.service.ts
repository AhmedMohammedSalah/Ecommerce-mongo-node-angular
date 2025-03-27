import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = 'http://localhost:3000'; 

  constructor(private http: HttpClient) {}


  // Fetch all orders
  getAllOrders() {

    // Retrieve the token from local storage
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {headers = headers.set('token', token);}

    return this.http.get(`${this.apiUrl}/orders/admin`, { headers });
  }


  // Update order status
  updateOrderStatus(orderId: string, newStatus: string) {
    return this.http.put(`${this.apiUrl}/orders/seller/update`, {
      orderId,
      newStatus,
    });
  }
}

