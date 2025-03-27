import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category, CategoryResponse } from '../../../interfaces/categoryInterface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProductService } from '../../../services/API/product.service';

@Component({
  selector: 'app-view-update-product-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './view-update-product-form.component.html',
  styleUrl: './view-update-product-form.component.css'
})
export class ViewUpdateProductFormComponent {

  //====ATTRIBUTES====
  productForm: FormGroup;
  catNames: string[] = [];                  // category names  
  categories: Category[] | null = null;     // category objects
  imagePreview: string | null = null;       // image
  response: any = [];                       // response
  selectedProduct: any = '';                // [NEW] : for object

  
  //====SERVICES====
  http = inject(HttpClient);
  productService = inject(ProductService);   // [NEW]


  //====ONINIT====
  ngOnInit() {
    this.getCategories();
    console.log("hello from on init...")
  }


  //====METHODS====

  // [NEW] [METHOD] : get data for selected product



  //====CONSTRUCTOR====
  constructor(fb: FormBuilder) {


    console.log("constructor is alive hello....");


    
    const req = Validators.required;
    const min = Validators.minLength;
    const max = Validators.maxLength;
    const minN = Validators.min;
    const maxN = Validators.max;

    this.productForm = fb.group({
      productImage: [null, [req]],
      category:       [''],
      productName:    ['', [req, min(3), max(40)]],
      productDesc:    ['', [req, min(20), max(100)]],
      stocks:         [0, minN(0)],
      productPrice:   [0, [req, minN(0)]],
      productDiscount:[0,[minN(0), maxN(100)]]
    });
  }


  // [METHOD]: get the formControls directly
  get formControls() { return this.productForm.controls; }


  // [METHOD] <for update>: fetch categories
  getCategories() {
    this.http.get<CategoryResponse>('http://127.0.0.1:3000/categories')
      .subscribe(res => {
        this.categories = res.categories;
        this.catNames = this.categories.map(e => e.name);
      });
  }


  // [METHOD]: Store image in buffer
  onFileSelected(event: Event) {
    const fileControl = this.productForm.get('productImage');
  
    if (event.target instanceof HTMLInputElement && event.target.files?.length) {
      const file = event.target.files[0];
  
      // store file 
      fileControl?.setValue(file);
      fileControl?.updateValueAndValidity();
  
      // show preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }


  // [MAIN METHOD] UPDATE

  /** Submit the form */
  onUpdate() {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error("Token is missing!");
      return;
    }
  
    let headers = new HttpHeaders({
      'token': token,
      'enctype': 'multipart/form-data'
    });

    const catName = this.productForm.get('category')?.value;

    // check category choosed
    if (!catName) {
      return console.log("category is required");
    }
    const catId = this.categories?.find(c => c.name == catName)?._id;

    const data = {
      "productName": this.productForm.get("productName")?.value,
      "description": this.productForm.get("productDesc")?.value,
      "price": this.productForm.get("productPrice")?.value,
      "discount": this.productForm.get("productDiscount")?.value,
      "stockQuantity": this.productForm.get("stocks")?.value,
      "categoryId": catId || ''
    };


    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    formData.append("productImg", this.productForm.get("productImage")?.value);


    this.http.post('http://127.0.0.1:3000/products', formData, { headers })
      .subscribe(response => {
        this.response = response;
        
        if ("msg" in response) {
          setTimeout(() => { 
            this.productForm.reset();
            this.imagePreview = null;
            this.response.msg = '';
          }, 3000);
        }
      });
  }

}
