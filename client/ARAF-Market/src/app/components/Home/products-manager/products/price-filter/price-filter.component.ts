import { Component } from '@angular/core';
import { ProductService } from '../../../../../services/API/product.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-price-filter',
  imports: [FormsModule],
  templateUrl: './price-filter.component.html',
  styleUrl: './price-filter.component.css'
})
export class PriceFilterComponent {
  minPrice: number | null = null;
  maxPrice: number | null = null;

  constructor(private productService: ProductService) {}

  onPriceFilter() {
    this.productService.setPriceFilter(this.minPrice, this.maxPrice);
  }
}

