import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, httpResource } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryResponse, Category } from '../../../interfaces/categoryInterface';

@Component({
  selector: 'app-add-product-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-product-form.component.html',
  styleUrl: './add-product-form.component.css'
})
export class AddProductFormComponent implements OnInit {

  imagePreview: string | null = null;
  http = inject(HttpClient)
  productForm: FormGroup;
  categories : Category[] | null = null;
  catNames : string[] = [];
  successMsg : any = '';
  showModal : string = '';

  ngOnInit(){
    this.getCategories();
  }

  // fetch categories
  getCategories(){
    this.http.get <CategoryResponse>('http://127.0.0.1:3000/categories').subscribe( res => {
      this.categories = res.categories;
      this.catNames = this.categories.map(e => e.name);
      console.log("category names = ", this.catNames);
    });
  }

  constructor(fb: FormBuilder) {
    const req = Validators.required;
    const min = Validators.minLength;
    const max = Validators.maxLength;

    this.productForm = fb.group({
      productImage: [null, [req]],
      category:       [''],
      productName:    ['speaker', [req, min(2), max(40)]],
      productDesc:    ['this is the most speaker I liked ever', [req, min(2), max(100)]],
      stocks:         [20, min(0)],
      productPrice:   [100, [req, min(0)]],
      productDiscount:[5,[min(0), max(100)]]
    });
  }

  /** function: store the image in buffer*/
  onFileSelected(event: Event) {
    const fileControl = this.productForm.get('productImage');
  
    if (event.target instanceof HTMLInputElement && event.target.files?.length) {
      const file = event.target.files[0];
  
      // store file in reactive form
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




  /** 📨 Submit the form */
  onSubmit() {
    // Get the token from localStorage
    const token = localStorage.getItem('token');
  
    // Ensure token is not null
    if (!token) {
      console.error("Token is missing!");
      return;
    }
  
    let headers = new HttpHeaders({
      'token': token,
      'enctype': 'multipart/form-data'
    });
    
  
    // Get category ID
    const catName = this.productForm.get('category')?.value;
    const catId = this.categories?.find(c => c.name == catName)?._id;
  
    // Create the data object
    const data = {
      "productName": this.productForm.get("productName")?.value,
      "description": this.productForm.get("productDesc")?.value, 
      "price": this.productForm.get("productPrice")?.value,
      "discount": this.productForm.get("productDiscount")?.value,
      "stockQuantity": this.productForm.get("stocks")?.value,
      "categoryId": catId || ''
    };
  
    // Create FormData
    const formData = new FormData();
    formData.append("data", JSON.stringify(data)); // Convert object to string
    formData.append("productImg", this.productForm.get("productImage")?.value);

    console.log("Token being sent:", token);
    console.log("Headers:", headers);

  
    // Send the request
    this.http.post('http://127.0.0.1:3000/products', formData, { headers })
      .subscribe(response => {
        if('msg' in response){
          this.successMsg =  response.msg;
          this.showModal = "success";
        }

      });
  }
  



}
  
