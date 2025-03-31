import { Component, inject } from '@angular/core';
import { ProductService } from '../../../../services/API/product.service';
import { JwtHelperService } from '@auth0/angular-jwt'
import { ProductCardComponent } from '../../../product/product-card/product-card.component';
import { AddProductFormComponent } from '../../add-product-form/add-product-form.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-seller-page',
  imports: [ProductCardComponent, AddProductFormComponent, RouterLink],
  templateUrl: './product-seller-page.component.html',
  styleUrl: './product-seller-page.component.css'
})
export class ProductSellerPageComponent {

  // attributes================
  sellerProducts : any = [];
  recievedProduct: any = null;              // get selected product

  //Service===============================
  productService = inject(ProductService);  // product service


  //===OnInitialize====================================================
  ngOnInit(){

    /* get + decrypt token + get seller id 
    --------------------------------------------------------------------------*/
    const token = localStorage.getItem('token');
    if(!token){ console.log("token not exist in local storage"); return; }
    const helper = new JwtHelperService();
    const decodedToken = helper.decodeToken(token);
    const sellerId = decodedToken?.user._id;
    if(!sellerId){console.log("seller id can not be reached from token"); return;}

    /* get products of seller
    -------------------------------------------------------- */
    this.productService.getSellerProducts(sellerId).subscribe(
      res => { this.sellerProducts = res; console.log("response =", res);})
  }
  //==============================================================================


  // [METHOD] remove removed product from product [4 real time]
  rmProductFromSellerProduct(recievedProduct: any){
    this.sellerProducts = this.sellerProducts.filter((product: any) => product._id !== recievedProduct._id )

  }

}

