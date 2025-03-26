import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../../services/API/product.service';

@Component({
  selector: 'app-search',
  imports: [FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
 searchTerm: string = '';

  constructor(private productService: ProductService) {}

  onSearch() {
    this.productService.setSearchFilter(this.searchTerm);
  }
}
