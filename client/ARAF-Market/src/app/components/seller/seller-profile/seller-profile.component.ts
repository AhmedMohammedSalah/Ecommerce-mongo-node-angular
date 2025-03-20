import { Component, inject, NgModule } from '@angular/core';
import { SellerProfileService } from '../../../services/API/seller-profile/seller-profile.service';
import { SellerPI } from '../../../interfaces/sellerInterfaces';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-seller-profile',
  imports: [CommonModule],
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
}



