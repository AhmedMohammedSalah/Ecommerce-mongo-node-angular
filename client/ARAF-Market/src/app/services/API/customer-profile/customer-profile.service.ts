// profile.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrlUser = 'http://127.0.0.1:3000/users/';
  private apiUrlCustomer = 'http://127.0.0.1:3000/customer/update-profile';

  constructor(private http: HttpClient) { }

  getUserProfile(): Observable<any> {
    const user = localStorage.getItem('user'); 

    return this.http.get(`${this.apiUrlUser}/users/`);
  }

  updateUserInfo(userData: any): Observable<any> {
    const userId = localStorage.getItem('user_id');
    return this.http.patch(`${this.apiUrlUser}/users/${userId}`, userData);
  }

  updateCustomerProfile(profileData: any): Observable<any> {
    return this.http.put(`${this.apiUrlUser}/customer/update-profile`, profileData);
  }
}
