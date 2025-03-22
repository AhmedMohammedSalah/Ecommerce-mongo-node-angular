import { Component } from '@angular/core';
import { ProductService } from '../../../../../services/API/product.service';
import { NgFor, NgIf } from '@angular/common';
import { ProductComponent } from "./product/product.component";
import { LoadingComponent } from "../../../../others/loading/loading.component";

@Component({
  selector: 'app-product-list',
  imports: [NgIf, NgFor, ProductComponent, LoadingComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  products: any[] = [];
  currentPage: number = 1;

  isLoading: boolean = true; 
  pageSize: number = 6; // number of products per page
  totalProducts: number = 0;
  totalPages: number = 0;
  totalPagesArray: number[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.isLoading = true;
    // Subscribe to any filter changes
    this.productService.products$.subscribe((data) => {
      this.products = data;
      this.totalProducts = data.length;
      this.updatePagination();
      this.isLoading = false;
    },
      (error) => {
        console.error('Error fetching products:', error);
        this.isLoading = false; // Hide loading animation
      }
    );

    // Initial fetch of all products
    this.productService.fetchAllProducts();
  }

  updatePagination() {
    // If you want client-side pagination:
    this.totalPages = Math.ceil(this.totalProducts / this.pageSize);
    this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);

    // Slice the products array to only show the current page
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.products = this.productService.allProducts.slice(startIndex, endIndex);
  }

  changePage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagination();
  }
}
