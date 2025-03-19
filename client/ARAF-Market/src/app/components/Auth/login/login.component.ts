import { Component } from '@angular/core';
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

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    const user:LoginUser = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    this.loginService.loginUser(user).subscribe({
      next: (response) => {
        if (response.token && response.user) {
        console.log(response);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        alert('Login successful! Redirecting to dashboard...');
        if (response.user.role == 'user')
          this.router.navigate(['/']);
        else if (response.user.role == 'seller')
          this.router.navigate(['/seller-dashboard']);
        else if (response.user.role == 'admin')
          this.router.navigate(['/seller-dashboard']);

      }
      },
      error: (error) => {
        this.isSubmitting = false;
        alert(
          error.error?.errors?.join('\n') || 'Login failed. Please try again.'
        );
        console.log(error);
      },
    });
  }
}
