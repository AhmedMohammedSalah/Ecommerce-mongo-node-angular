import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SellerPI } from '../../../interfaces/sellerInterfaces';
import { HttpHeaders } from '@angular/common/http';

const port = '3000'  



@Injectable({
  providedIn: 'root'
})
export class SellerProfileService {

  constructor(private http: HttpClient){}


  // [SALAH] FUNCTION-----------------------------------------------------------------
  getUserProfile(): any {
    // GET USER DATA FROM LOCALSTORAGE
    const userString = localStorage.getItem('user');
    if (userString) {
      try { return JSON.parse(userString);}
      catch (error) { console.error('Error parsing user data:', error); return null; }
    } return null; // NO USER DATA FOUND
  }
  //---------------------------------------------------------------------------------


  getToken(){
    const token = localStorage.getItem('token') ;
    if(!token){console.log("token not in header. check it");}
    return token;
  }


  
  getSellerData(): Observable<SellerPI>{

    let userData = this.getUserProfile();
    let token = this.getToken() || '';
    let headers = new HttpHeaders().set('token', token);

    console.log("user data id = ", userData._id);

    return this.http.get<SellerPI>(`http://127.0.0.1:${port}/seller/${userData._id}`, { headers });
  }

}
