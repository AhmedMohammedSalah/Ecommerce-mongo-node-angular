import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { ProductService } from '../../../../../services/API/product.service';

@Component({
  selector: 'app-category',
  imports: [NgFor],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent {
 categories: any[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this.productService.getCategories().subscribe((data: any) => {
      this.categories = data.categories;
    });
  }

  onSelectCategory(categoryId: string) {
    this.productService.setCategoryFilter(categoryId);
  }
}
