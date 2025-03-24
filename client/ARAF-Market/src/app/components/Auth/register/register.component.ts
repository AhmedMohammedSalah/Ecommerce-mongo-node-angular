
import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule  } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterService } from '../../../services/API/register/register.service';
import { RegisteredUser } from '../../../types/regijster.interface';
import { HeaderComponent } from "../../Home/header/header.component";
import { FooterComponent } from "../../Home/footer/footer.component";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgIf, FormsModule, HeaderComponent, FooterComponent],
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;
  isSubmitting = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private fb: FormBuilder, private router: Router, private registerService: RegisterService) {
    this.registerForm = this.fb.group({
      role: ['', Validators.required],
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
        ]
      ]
    });
  }

  onReset(): void {
    this.registerForm.reset();
    this.submitted = false;
    this.errorMessage = '';
    this.successMessage = '';
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData: RegisteredUser = {
      name: this.registerForm.value.name,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      role: this.registerForm.value.role
    };

    this.registerService.registerUser(formData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.successMessage = '🎉 Registration successful! Redirecting to login page...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      error: (error: any) => {
        console.error('Registration failed:', error);
        this.isSubmitting = false;

        if (error.status === 400) {
          if (error.error?.message?.includes('Email already exists')) {
            this.errorMessage = '🚨 This email is already registered. Please use a different one or log in.';
          } else if (error.error?.message?.includes('Password must contain')) {
            this.errorMessage = '⚠️ Password must contain at least one letter and one number.';
          } else if (error.error?.message?.includes('password length must be')) {
            this.errorMessage = '🔑 Password must be at least 6 characters long.';
          } else {
            this.errorMessage = '❌ Registration failed. Please try again.';
          }
        } else {
          this.errorMessage = '❌ Server connection issue. Try again later.';
        }
      }
    });
  }
}
