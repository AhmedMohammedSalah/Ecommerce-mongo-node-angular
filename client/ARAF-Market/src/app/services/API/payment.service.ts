import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
interface PaymentResponse {
  approvalUrl: string;
  paymentId: string;
  orderId: string;
}
@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = `http://127.0.0.1:3000/`;

  constructor(private http: HttpClient) {}
  createPayment(paymentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}pay`, paymentData);
  }
  executePaypal(paypalData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}execute`, paypalData);
  }
  createPaypalPayment(orderId: string, amount: number) {
    return this.http.post<PaymentResponse>(`${this.apiUrl}/create`, {
      orderId,
      amount,
      currency: 'USD',
      paymentMethod: 'PAYPAL',
    });
  }

  executePaypalPayment(paymentId: string, payerId: string) {
    return this.http.post<{ orderId: string }>(`${this.apiUrl}/execute`, {
      paymentId,
      payerId,
    });
  }
}
