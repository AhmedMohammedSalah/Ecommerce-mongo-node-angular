// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class RegisterService {

//   constructor( private http: HttpClient) { }
//   registerUser(user: any) : Observable<any> {
//     return this.http.post('http://127.0.0.1:3000/auth/signup', user);

//   }


// }


import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisteredUser } from '../../../types/regijster.interface';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private http: HttpClient) {}

  registerUser(user: RegisteredUser): Observable<any> {
    console.log(user)
    return this.http.post('http://127.0.0.1:3000/auth/signup', user);
  }
}
