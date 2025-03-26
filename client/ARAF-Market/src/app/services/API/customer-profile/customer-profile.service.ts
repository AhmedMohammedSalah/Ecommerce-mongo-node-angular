// profile.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = 'http://127.0.0.1:3000'; //[SENU] PORT
  

  constructor(private http: HttpClient) { }

  getUserProfile(): any {
    const userString = localStorage.getItem('user'); // Get the user string from localStorage
    if (userString) {
      try {
        return JSON.parse(userString); // Parse the string into an object
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null; // Return null if parsing fails
      }
    }
    return null; // Return null if no user data is found
  }

  updateUserInfo(userData: any): Observable<any> {
    const userString = localStorage.getItem('user');
    if (!userString) {
      return throwError(() => new Error('User data not found in localStorage'));
    }

    try {
      const user = JSON.parse(userString);
      if (!user || !user._id) {
        return throwError(() => new Error('Invalid user data: _id is missing'));
      }
      const userId = user._id;
      user.name = userData.name;
      user.email = userData.email;
      localStorage.setItem('user', JSON.stringify(user));
      let tokenStr = localStorage.getItem('token') || ''
      console.log(tokenStr);
      
      return this.http.put(`${this.apiUrl}/user/${userId}`, userData, {
        headers:{
						token:tokenStr
					}
      });
    } catch (error:any) {
      return throwError(() => new Error('Error parsing user data: ' + error.message));
    }
  }

  updateCustomerProfile(profileData: any): Observable<any> {

      let tokenStr = localStorage.getItem('token') || ''
    return this.http.put(`${this.apiUrl}/customer/update-profile`, profileData,
      {headers:{
						token:tokenStr
      }
      }
    );
  }
}
