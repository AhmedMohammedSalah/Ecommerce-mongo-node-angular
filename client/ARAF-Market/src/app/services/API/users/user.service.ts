import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Users } from '../../../types/users.interface';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserServicesService {

  constructor(private http: HttpClient) {}

  // getUsers(): Observable<Users[]> { 
  //   return this.http.get<Users[]>("");
  // }
  getUsers(): Observable<Users[]> { 
  
  return this.http.get<Users[]>("http://localhost:3000/users").pipe(
    map(users => users.filter(user => user.role === 'user'))
  );
}

}
