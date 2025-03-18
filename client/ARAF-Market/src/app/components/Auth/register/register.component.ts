import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterService } from '../../../services/API/register.service';
import { RegisteredUser } from '../../../types/regijster.interface';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,NgIf],
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;
  isSubmitting = false;

  constructor(private fb: FormBuilder, private router: Router, private registerService: RegisterService) {
    this.registerForm = this.fb.group({
      role: ['', Validators.required],
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onReset(): void {
    this.registerForm.reset();
    this.submitted = false;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    const formData:RegisteredUser = {
      name: this.registerForm.value.name,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      role: this.registerForm.value.role,
    };

    this.registerService.registerUser(formData).subscribe({
      next: () => {
        alert('Registration successful! Redirecting to login page...');
        this.router.navigate(['/login']);
      },
      error: (error: any) => {
        console.error('Registration failed:', error);
        alert(error.error?.errors?.join('\n') || 'Registration failed. Please try again.');
      }
    });
  }

}
