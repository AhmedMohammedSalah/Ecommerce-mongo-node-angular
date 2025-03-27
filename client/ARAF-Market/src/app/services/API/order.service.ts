import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = `http://127.0.0.1:3000/orders`;
  private allPrice = new BehaviorSubject<number>(0);
  constructor(private http: HttpClient) {}
  getAllPrice() {
    return this.allPrice.asObservable();
  }
  setAllPrice(newCounter: number) {
    this.allPrice.next(newCounter);
  }
  createOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, orderData);
  }

  getOrders() {
    return this.http.get(this.apiUrl);
  }

  getOrderById(orderId: string) {
    return this.http.get(`${this.apiUrl}/${orderId}`);
  }
}
