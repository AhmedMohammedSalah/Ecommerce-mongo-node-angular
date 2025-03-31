import { Component, inject, NgModule } from '@angular/core';
import { SellerProfileService } from '../../../services/API/seller-profile/seller-profile.service';
import { SellerPI } from '../../../interfaces/sellerInterfaces';
import { CommonModule } from '@angular/common';
import { AddProductFormComponent } from "../add-product-form/add-product-form.component";
import { Router } from '@angular/router';
import { ProductService } from '../../../services/API/product.service';
import { ProductCardComponent } from '../../product/product-card/product-card.component';


@Component({
  selector: 'app-seller-profile',
  imports: [CommonModule, AddProductFormComponent, ProductCardComponent],
  templateUrl: './seller-profile.component.html',
  styleUrl: './seller-profile.component.css'
})


export class SellerProfileComponent {

  // ATTRIBUTES=======================
  sellerData : SellerPI | null = null;
  userData: any;
  latestSellerProdct : any = null; 


  //=SERVICE=====================================
  sellerServiceAPI = inject(SellerProfileService); // inject seller service
  productService = inject(ProductService);


  //=ONINITIALIZED======================================= 
    ngOnInit(){

      // get response from the injected seler service
      this.sellerServiceAPI.getSellerData().subscribe(
        res => {
         this.sellerData = res
         console.log("response from seller serivce = ",res);
        console.log("sellerData = ", this.sellerData);
    })

      

      // store data in the userData 
      this.userData = this.sellerServiceAPI.getUserProfile();


    // Find the latest seller product 
    this.productService.getSellerProducts(this.userData?.user?._id).subscribe(products => {
      if (!products || products.length === 0) {
        console.log("No products found for this seller.");
        return;
      }

      // Ensure timestamps are correctly formatted before comparison
      this.latestSellerProdct = products.reduce((latest: any, product: any) => {
        const latestTimestamp = new Date(latest.createdAt).getTime();
        const productTimestamp = new Date(product.createdAt).getTime();
        
        return productTimestamp > latestTimestamp ? product : latest;
      }, products[0]); // Use the first product as the initial value

      console.log("Latest Seller Product:", this.latestSellerProdct);
    });




    }

  //=METHODS============================
  constructor(private router: Router) {}



  // handle bubbling
  openAddProductModal(event: MouseEvent){
    event.stopPropagation();
    event.preventDefault();
  }

  // redirect to hanle bubbling
  redirectToComponent() {
    this.router.navigate(['/seller-dashboard/products']);
  }
  
}



