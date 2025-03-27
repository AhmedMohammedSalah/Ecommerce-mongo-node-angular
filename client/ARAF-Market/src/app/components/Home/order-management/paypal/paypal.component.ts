declare var paypal: any;
import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PaymentService } from '../../../../services/API/payment.service';
import { Router } from '@angular/router';
import { FooterComponent } from '../../footer/footer.component';
import { HeaderComponent } from '../../header/header.component';
import { NgIf } from '@angular/common';

import {
  ICreateOrderRequest,
  IPayPalConfig,
  NgxPayPalModule,
} from 'ngx-paypal';
import { OrderService } from '../../../../services/API/order.service';
@Component({
  selector: 'app-paypal',
  imports: [
  FooterComponent,
    HeaderComponent,
    ReactiveFormsModule,
    NgIf,
    NgxPayPalModule,
  ],
  templateUrl: './paypal.component.html',
  styleUrl: './paypal.component.css',
})
export class PaypalComponent implements OnInit {
  public payPalConfig?: IPayPalConfig;
  loading = false;
  error: string = '';
  success: string = '';
  allPrice: number = 0;

  constructor(private paymentService: PaymentService, private router: Router,
  private orderService: OrderService) { }

  ngOnInit(): void {
    this.initPayPalConfig();
  }

  private initPayPalConfig(): void {
    this.orderService.getAllPrice().subscribe((response)=>this.allPrice=response);
    this.payPalConfig = {
      currency: 'USD',
      clientId:
        'AbLRWLm3NZT8Ine3miqGN5QaiEmvh4ZkthhI3I1-vsXS2M8xc59M361uPy83F_U5GOxhMuBstTUgwL38',
      createOrderOnClient: (data) =>
        <ICreateOrderRequest>{
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'USD',
                value: String(this.allPrice),
                breakdown: {
                  item_total: {
                    currency_code: 'USD',
                    value: String(this.allPrice),
                  },
                },
              },
              items: [
                {
                  name: 'Item 1',
                  quantity: '1',
                  category: 'DIGITAL_GOODS',
                  unit_amount: {
                    currency_code: 'USD',
                    value: String(this.allPrice),
                  },
                },
              ],
            },
          ],
        },
      advanced: {
        commit: 'true',
      },
      style: {
        label: 'paypal',
        layout: 'vertical',
      },
      onApprove: (data, actions) => {
        console.log(
          'onApprove - transaction approved, but not authorized',
          data,
          actions
        );
        this.router.navigate(['/orders']);
        // Optionally, you could capture the order here on the client side:
        // actions.order.get().then(details => console.log('Order details:', details));
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - transaction completed', data);
        // Optionally, if you need to send data to your backend after authorization:
        // this.paymentService.capturePayment(data).subscribe(...);
        this.success = 'Payment executed successfully!';

        this.router.navigate(['/orders']);
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: (err) => {
        console.error('OnError', err);
        this.error = 'An error occurred during the PayPal transaction.';
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }
}
