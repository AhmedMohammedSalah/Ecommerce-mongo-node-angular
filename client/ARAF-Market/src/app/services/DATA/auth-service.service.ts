import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoginUser } from '../../types/login.interface'
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();


  constructor() {
    this.checkLoginStatus();
  }

  // Check localStorage for login status
  private checkLoginStatus() {
    const user = localStorage.getItem('user');
    this.isLoggedInSubject.next(!!user);
  }

  redirectToLoginWithReturnUrl(returnUrl: string): void {
    const router = inject(Router);
    router.navigate(['/login'], { queryParams: { returnUrl } });
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }

  login(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
    this.isLoggedInSubject.next(true);
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.isLoggedInSubject.next(false);
  }
}
