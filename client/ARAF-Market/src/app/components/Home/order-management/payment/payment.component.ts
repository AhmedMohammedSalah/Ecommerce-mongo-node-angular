import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../../../services/API/payment.service';
import { PaymentResponse } from '../../../../interfaces/interfaces';
import { NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FooterComponent } from "../../footer/footer.component";
import { HeaderComponent } from "../../header/header.component";

@Component({
  selector: 'app-payment',
  imports: [NgIf, FooterComponent, HeaderComponent, ReactiveFormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css',
})
export class PaymentComponent implements OnInit {
  paymentForm: FormGroup;
  loading: boolean = false;
  paymentError: string = '';
  paymentSuccess: string = '';
  order: any;

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private router: Router
  ) {
    this.paymentForm = this.fb.group({
      orderId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // If the order details were passed from the Order component via navigation state:
    if (history.state.order) {
      this.order = history.state.order;
      this.paymentForm.patchValue({ orderId: this.order._id });
    }
  }

  onSubmit(): void {
    // If the form is invalid, do not proceed.
    if (this.paymentForm.invalid) return;

    this.loading = true;
    this.paymentError = '';
    this.paymentSuccess = '';

    this.paymentService.createPayment(this.paymentForm.value).subscribe({
      next: (response: any) => {
        this.loading = false;
        this.paymentSuccess =
          response.message || 'Payment processed successfully!';

        this.router.navigate(['/paypal'], {
            state: { payment: response.payment },
          });

      },
      error: (err) => {
        this.loading = false;
        this.paymentError = 'Payment failed. Please try again.';
        console.error('Payment error:', err);
      },
    });
  }
}
