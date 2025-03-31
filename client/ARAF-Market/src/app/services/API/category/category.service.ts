import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export interface Category {
  _id: string;
  name: string;
  description: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryResponse {
  message: string;
  category: Category;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  http = inject(HttpClient);

  // get categoryName by Id
  getCatName(catID : string): Observable<CategoryResponse>{
    return this.http.get<CategoryResponse>(`http://127.0.0.1:3000/categories/${catID}`);
  }
}
