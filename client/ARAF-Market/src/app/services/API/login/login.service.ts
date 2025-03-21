import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginUser } from '../../../types/login.interface';

// [FM] Edit : This service is used to make API calls to the server

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  loginUser(user: LoginUser): Observable<any> {
    console.log(user);
    return this.http.post('http://127.0.0.1:3000/auth/signin', user); 
  }
}
