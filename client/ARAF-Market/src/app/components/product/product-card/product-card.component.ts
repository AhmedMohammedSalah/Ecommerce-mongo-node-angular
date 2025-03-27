import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ProductService } from '../../../services/API/product.service';
import { CommonModule } from '@angular/common';
import { ViewUpdateProductFormComponent } from '../view-update-product-form/view-update-product-form.component';

@Component({
  selector: 'app-product-card',
  imports: [CommonModule, ViewUpdateProductFormComponent],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {

  //=Attributes============
  isModalOpen = false;        //[NEW]
  @Input() productData : any;
  @Output() sentProduct = new EventEmitter<any>();
  selectedProduct : any = null; //store selected product


  //=Service=============================
  productService = inject(ProductService);

  
  /* [METHOD]: onClick update selected 
  --------------------------------------*/
  setSelectedProduct(product: any) {
    localStorage.setItem('selectedProduct', JSON.stringify(product)); //😭😭😭😭😭
    console.log("product added in the local storage =", product);

    this.openModal(); // [NEW]
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



  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  


}
