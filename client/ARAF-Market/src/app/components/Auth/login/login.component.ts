import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../../services/API/login/login.service';
import { CommonModule } from '@angular/common';
import { LoginUser } from '../../../types/login.interface';
import { AuthServiceService } from '../../../services/DATA/auth-service.service';
import { HeaderComponent } from '../../Home/header/header.component';
import { FooterComponent } from '../../Home/footer/footer.component';
import { CartService } from '../../../services/API/cart.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    HeaderComponent,
    FooterComponent,
  ],
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  isSubmitting = false;
  authServiceService = inject(AuthServiceService);

  showAlert = false;
  alertMessage = '';
  alertType = 'success';
  isLoggedIn: boolean = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthServiceService,
    private loginService: LoginService,
    private cartService: CartService
  ) {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
          ), // example: example@gmail.com
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/),
        ], // example: hello123
      ],
    });
  }
  ngOnInit() {
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
    if (this.isLoggedIn) {
      this.router.navigate(['/']);

      const userData = localStorage.getItem('user');
      const userRole = userData ? JSON.parse(userData).role : null;
      if (userRole == 'user') this.router.navigate(['/']);
      else if (userRole == 'seller')
        this.router.navigate(['/seller-dashboard']);
      else if (userRole == 'admin') this.router.navigate(['/seller-dashboard']);
    }
  }
  onSubmit(): void {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    const user: LoginUser = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    this.loginService.loginUser(user).subscribe({
      next: (response) => {
        if (response.token && response.user) {
          console.log(response);
          localStorage.setItem('token', response.token); // [SENU]: 🙂 SHOULD BE PUT IN HEADER!!!!!!![your fault took me 2 hours to catch]
          this.authServiceService.login(response.user);

          this.showAlert = true;
          this.alertMessage = 'Login successful! Redirecting to dashboard...';
          this.alertType = 'success';

          if (response.user.role == 'user') {
            setTimeout(() => this.router.navigate(['/']), 1000);
          } else if (response.user.role == 'seller')
            this.router.navigate(['/seller-dashboard']);
          else if (response.user.role == 'admin')
            this.router.navigate(['/admin-dashboard']);
        }
      },
      error: (error) => {
        this.isSubmitting = false;

        this.showAlert = true;
        if ((error.status = 401)) {
          this.alertMessage =
            'User is not verified , please confirm your mail ';
          this.alertType = 'danger';
        } else {
          this.alertMessage =
            error.error?.errors?.join('\n') ||
            'Login failed. Please try again.';
          this.alertType = 'danger';

          console.log(error);
        }
      },
    });
  }
  ngOnDestroy() {
                this.refreshCart();

  }
  refreshCart() {
    this.cartService.syncGuestCart();
  }
}
