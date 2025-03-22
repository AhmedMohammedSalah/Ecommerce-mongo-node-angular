import { Component, inject, NgModule } from '@angular/core';
import { SellerProfileService } from '../../../services/API/seller-profile/seller-profile.service';
import { SellerPI } from '../../../interfaces/sellerInterfaces';
import { CommonModule } from '@angular/common';
import { AddProductFormComponent } from "../add-product-form/add-product-form.component";


@Component({
  selector: 'app-seller-profile',
  imports: [CommonModule, AddProductFormComponent],
  templateUrl: './seller-profile.component.html',
  styleUrl: './seller-profile.component.css'
})


export class SellerProfileComponent {

  sellerData : SellerPI | null = null;
  userData: any;

  sellerServiceAPI = inject(SellerProfileService);

  ngOnInit(){
    
    this.sellerServiceAPI.getSellerData().subscribe(
      res => this.sellerData = res
    )

    this.userData = this.sellerServiceAPI.getUserProfile();
  }


  // Adding product
  addProduct(){


    // get data from the HTML form 


    // send it [POST] to the endpoint that add product + [TOKEN IN HEADER]

  }



}



