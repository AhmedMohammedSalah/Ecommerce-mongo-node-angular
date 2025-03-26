import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ProductService } from '../../../services/API/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {

  //=Attributes============
  @Input() productData : any;
  @Output() sentProduct = new EventEmitter<any>();
  selectedProduct : any = null; //store selected product


  //=Service=============================
  productService = inject(ProductService);

  
  /* [METHOD]: onClick update selected 
  --------------------------------------*/
  setSelectedProduct(product: any) {
    localStorage.setItem('selectedProduct', JSON.stringify(product)); //😭😭😭😭😭
  }

  /*[METOHD]: remove the product using the service
  ------------------------------------------------*/
  rmProduct(){

    let selectedProductString = localStorage.getItem('selectedProduct'); //😭😭😭😭😭
    let selectedProduct = selectedProductString ? JSON.parse(selectedProductString) : null;

    // remove from DB
    let PID = selectedProduct?._id;
    this.productService.removeProduct(PID).subscribe(
      res => console.log("response = ", res)
    )

    // send to parent to remove from productSeller
    this.sentProduct.emit(selectedProduct);
  }


}
