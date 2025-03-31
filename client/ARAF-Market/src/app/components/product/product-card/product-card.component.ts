import { Component, EventEmitter, inject, Input, Output, ViewChild, TemplateRef } from '@angular/core';
import { ProductService } from '../../../services/API/product.service';
import { CommonModule } from '@angular/common';
import { ViewUpdateProductFormComponent } from '../view-update-product-form/view-update-product-form.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-card',
  standalone: true, 
  imports: [CommonModule, ViewUpdateProductFormComponent], 
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})


export class ProductCardComponent {

  //=Attributes=================================
    @Input() productData : any;
    @Output() sentProduct = new EventEmitter<any>();
    isUpdate : boolean = true;                        // the button in the parent so, this is the signal for the child
    selectedProduct : any = null;                     // store selected product: used in removal



  //=Services=============================
    productService = inject(ProductService);
    private modalService = inject(NgbModal); // Inject NgbModal properly


  //#region===METHODS===========================
   

    /* [METHOD]: onClick update selected 
    --------------------------------------*/
    setSelectedProduct(product: any) {
      this.selectedProduct = product;
    }

    /* [NEW] [METHOD]: Open modal using NgbModal
    ----------------------------------------------*/
    openModal(content: TemplateRef<any>) {
      this.modalService.open(content, { centered: true, size: 'lg' });
    }

    /* [METHOD]: remove the product using the service
    -------------------------------------------------*/
    rmProduct(){
      // remove from DB + from the seen list
      this.productService.removeProduct(this.selectedProduct._id);
      this.sentProduct.emit(this.selectedProduct);
    }

    /* [METHOD]: update*/
    update(){ this.isUpdate = (this.isUpdate == true)?  false : true; }


    /* [METHOD]: return value to default */
    onCloseModal(defaultUpdateValue : boolean){ this.isUpdate = defaultUpdateValue; }
  
  //#endregion
}
