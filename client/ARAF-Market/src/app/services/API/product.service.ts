// src/app/services/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'http://127.0.0.1:3000/products';

  // Store the fetched products
  allProducts: any[] = [];
  private productsSubject = new BehaviorSubject<any[]>([]);
  products$ = this.productsSubject.asObservable();

  // Keep track of filters
  private categoryId: string | null = null;
  private searchTerm: string = '';
  private minPrice: number | null = null;
  private maxPrice: number | null = null;

  constructor(private http: HttpClient) {}

  // 1) Fetch all products
  fetchAllProducts() {
    this.http.get<any[]>(this.baseUrl).subscribe((data) => {
      this.allProducts = data;
      this.productsSubject.next(data);
    });
  }

  // 2) Set category filter
  setCategoryFilter(categoryId: string) {
    this.categoryId = categoryId;
    this.fetchProductsByCategory();
  }

  fetchProductsByCategory() {
    if (!this.categoryId) {
      this.fetchAllProducts();
      return;
    }
    const url = `http://127.0.0.1:3000/products/category/${this.categoryId}`;
    this.http.get<any[]>(url).subscribe((data) => {
      this.allProducts = data;
      this.productsSubject.next(data);
    });
  }

  // 3) Set search filter
  setSearchFilter(term: string) {
    this.searchTerm = term;
    this.fetchProductsBySearch();
  }

  fetchProductsBySearch() {
    if (!this.searchTerm) {
      this.fetchAllProducts();
      return;
    }
    const url = `${this.baseUrl}/search/${this.searchTerm}`;
    this.http.get<any[]>(url).subscribe((data) => {
      this.allProducts = data;
      this.productsSubject.next(data);
    });
  }

  // 4) Set price filter
  setPriceFilter(min: number | null, max: number | null) {
    this.minPrice = min;
    this.maxPrice = max;
    this.fetchProductsByPrice();
  }

  fetchProductsByPrice() {
    let url = `${this.baseUrl}/price`;
    if (this.minPrice !== null && this.maxPrice !== null) {
      url += `/${this.maxPrice}/${this.minPrice}`;
    } else if (this.maxPrice !== null) {
      url += `/${this.maxPrice}`;
    } // adapt if your API logic differs
    this.http.get<any[]>(url).subscribe((data) => {
      this.allProducts = data;
      this.productsSubject.next(data);
    });
  }

  // 5) Get product by ID
  getProductById(id: string): Observable<any> {
    const url = `http://127.0.0.1:3000/product/${id}`;
    return this.http.get<any>(url);
  }

  getSeller(id: string): Observable<any> {
    const url = `http://127.0.0.1:3000/user/seller/${id}`;
    return this.http.get<any>(url);
  }
  // 6) (Optional) getCategories
  getCategories(): Observable<any> {
    // If you have an endpoint for categories, call it
    // e.g.
    return this.http.get('http://127.0.0.1:3000/categories');
    // Otherwise, return a static list for demonstration:
    // return new BehaviorSubject([
    //   { id: 'smartphone', name: 'Smartphone' },
    //   { id: 'computer', name: 'Computer' },
    //   { id: 'camera', name: 'Camera & Photo' },
    //   // ...
    // ]).asObservable();
  }
  getProductsByIds(productIds: string[]): Observable<any[]> {
    return this.http.post<any[]>('http://127.0.0.1:3000/products/by-ids', {
      ids: productIds,
    });
  }


  // [SENU]: get product of the seller
  // any: should change to interface of the product
  getSellerProducts(sellerId: string): Observable<any>{
    return this.http.get(`http://127.0.0.1:3000/products/seller/${sellerId}`);
  }


  // [SENU]: remove product
  removeProduct(PID : string){
    return this.http.delete(`http://127.0.0.1:3000/products/hardDel/${PID}`);
  }


}
