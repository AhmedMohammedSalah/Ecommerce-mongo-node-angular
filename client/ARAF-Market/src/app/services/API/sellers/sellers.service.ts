import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable ,map } from 'rxjs';
import { Seller } from '../../../types/sellers.interface';

@Injectable({
  providedIn: 'root'
})
export class SellersService {


  constructor(private http: HttpClient) {}

  getSellers(): Observable<Seller[]> {
    return this.http.get<Seller[]>(" ").pipe(
      map(users => users.filter(user => user.role === 'seller')) 
    );
  }
}
