import { Component } from '@angular/core';
import { CategoryComponent } from "./category/category.component";
import { SearchComponent } from "./search/search.component";
import { PriceFilterComponent } from "./price-filter/price-filter.component";
import { ProductListComponent } from "./product-list/product-list.component";

@Component({
  selector: 'app-products',
  imports: [CategoryComponent, SearchComponent, PriceFilterComponent, ProductListComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {

}
