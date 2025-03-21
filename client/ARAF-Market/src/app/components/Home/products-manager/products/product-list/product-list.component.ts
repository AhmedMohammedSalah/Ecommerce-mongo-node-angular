import { Component } from '@angular/core';
import { ProductService } from '../../../../../services/API/product.service';
import { NgFor } from '@angular/common';
import { ProductComponent } from "./product/product.component";

@Component({
  selector: 'app-product-list',
  imports: [NgFor, ProductComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  products: any[] = [];
  currentPage: number = 1;
  pageSize: number = 6; // number of products per page
  totalProducts: number = 0;
  totalPages: number = 0;
  totalPagesArray: number[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    // Subscribe to any filter changes
    this.productService.products$.subscribe((data) => {
      this.products = data;
      this.totalProducts = data.length;
      this.updatePagination();
    });

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
