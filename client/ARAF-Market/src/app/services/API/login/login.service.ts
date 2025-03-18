import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

/*
 * (FM) Edit : This service is used to make API calls to the server
 */
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private baseUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  login(email: string, password: string, role: string): Observable<any> {
    const url = `${this.baseUrl}?email=${email}&password=${password}&role=${role}`;
    return this.http.get<any[]>(url).pipe(
      map((users) => {
        if (users.length > 0) {
          localStorage.setItem('user', JSON.stringify(users[0]));
          return users[0];
        } else {
          throw new Error('Invalid credentials');
        }
      }),
      catchError(() => throwError(() => new Error('Login failed')))
    );
  }
}
