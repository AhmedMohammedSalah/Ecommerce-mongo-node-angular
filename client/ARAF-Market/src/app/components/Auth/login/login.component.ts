import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../../services/API/login/login.service';

/*
 * (FM) Edit : This component is used to display the login form
 */
@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    role: new FormControl('', [Validators.required]),
  });

  loading = false;
  errorMessage = '';

  constructor(private loginService: LoginService, private router: Router) {}

  onLogin() {
    // if (this.loginForm.invalid) return;

    // this.loading = true;
    // const { email, password, role } = this.loginForm.value;

    // this.loginService.login(email!, password!, role!).subscribe({
    //   next: () => {
    //     this.loading = false;
    //     if (role === 'admin') this.router.navigate(['/admin']);
    //     else if (role === 'seller') this.router.navigate(['/seller']);
    //     else this.router.navigate(['/home']);
    //   },
    //   error: () => {
    //     this.errorMessage = 'Invalid credentials';
    //     this.loading = false;
    //   },
    // });
  }
}
