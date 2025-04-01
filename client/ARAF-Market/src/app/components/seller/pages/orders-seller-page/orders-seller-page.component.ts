import { Component, inject } from '@angular/core';
import { SellerProfileService } from '../../../../services/API/seller-profile/seller-profile.service';
import { ProfileService } from '../../../../services/API/customer-profile/customer-profile.service';
import { ProductService } from '../../../../services/API/product.service';
import { CategoryService } from '../../../../services/API/category/category.service';

@Component({
  selector: 'app-orders-seller-page',
  imports: [],
  templateUrl: './orders-seller-page.component.html',
  styleUrl: './orders-seller-page.component.css'
})
export class OrdersSellerPageComponent {

  sellerServiceAPI = inject(SellerProfileService);  // inject seller service
  customerServiceAPI = inject(ProfileService);      // inject customer service
  productService = inject(ProductService);          // inject product service
  categoryService = inject(CategoryService);

  sellerData : any;
  customerData : any;
  sellerOrders : Array<any> = [];
  detailedSellerOrders: Array<any> = [];

  ngOnInit(){

    console.log("beginning of ng on init..."); //debug

    // get response from the injected seler service
    this.sellerServiceAPI.getSellerData().subscribe( res => { 

      this.sellerOrders = res.orders
      for(let order of this.sellerOrders){

        let detailedOrder : any = {}; 

        // get details of the user
        this.customerServiceAPI.getUserInfoById(order.userId).subscribe(
          res => {
            detailedOrder["customerEmail"] = res.email;
            detailedOrder["customerName"] = res.name;
        })

        let detailedProductsArray :any = [];
        for(let p of order.products){//==============================

          let detailedProduct: any= {}; 

          // get product data
          this.productService.getProductById(p.productId).subscribe(
            res => {
              detailedProduct["productName"] = res.productName;
              detailedProduct["productImagePath"] =res.imagePath;
              
              // get category name
              this.categoryService.getCatName(res.categoryId).subscribe(
                res => detailedProduct['categoryName'] = res.category.name
              )

          })

          // add residual product data from what exist
          detailedProduct["productPrice"] = p.price;
          detailedProduct['quantity'] = p.quantity;
          detailedProduct['discount'] = p.discount;
          detailedProductsArray.push(detailedProduct);

        }//==============================================================

        // push the product array to the detailed order
        detailedOrder["detailedProducts"]=detailedProductsArray;
        detailedOrder['status']= order.status;
        this.detailedSellerOrders.push(detailedOrder);
      }

      console.log("detailed seller orders = ", this.detailedSellerOrders);
  });

  



  } 


}


// get the name and email of the customer to be view on the order
// get the product info to be used in the order