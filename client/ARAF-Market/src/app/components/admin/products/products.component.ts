import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../services/API/product.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    RouterModule,
    FormsModule
  ]
})
export class ProductsComponent implements OnInit {
  products$: Observable<any[]>;
  categories$: Observable<any[]>;
  searchTerm: string = '';
  selectedCategory: string | null = null;
  minPrice: number | null = null;
  maxPrice: number | null = null;
  isLoading: boolean = false;

  constructor(private productService: ProductService) {
    this.products$ = this.productService.products$;
    this.categories$ = this.productService.getCategories();
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.productService.fetchAllProducts();
    this.products$.subscribe(() => this.isLoading = false);
  }

  applyFilters(): void {
    this.productService.setSearchFilter(this.searchTerm);
    if (this.selectedCategory) {
      this.productService.setCategoryFilter(this.selectedCategory);
    }
    if (this.minPrice !== null || this.maxPrice !== null) {
      this.productService.setPriceFilter(this.minPrice, this.maxPrice);
    }
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = null;
    this.minPrice = null;
    this.maxPrice = null;
    this.productService.fetchAllProducts();
  }

  deleteProduct(id: string): void {
    this.productService.getProductById(id).subscribe(() => {
      this.productService.fetchAllProducts();
    });
  }
}



// import { Component, OnInit } from '@angular/core';
// import { ProductService } from '../../../services/API/product.service';
// @Component({
//   selector: 'app-products',
//   templateUrl: './products.component.html',
//   styleUrls: ['./products.component.css']
// })
// export class ProductsComponent implements OnInit {
//   products: any[] = [];

//   constructor(private productService: ProductService) {}

//   ngOnInit(): void {
//     this.productService.products$.subscribe((data) => {
//       this.products = data;
//     });
//     this.productService.fetchAllProducts();
//   }

//   deleteProduct(id: string): void {
//     const url = `http://127.0.0.1:3000/product/${id}`;
//     this.productService.getProductById(id).subscribe(() => {
//       this.products = this.products.filter(product => product.id !== id);
//     });
//   }
// }