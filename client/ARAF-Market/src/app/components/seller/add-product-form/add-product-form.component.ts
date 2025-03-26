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
  response : any = [];

  ngOnInit(){
    this.getCategories();
  }


  // get the formControls directly 
  get formControls(){
    return this.productForm.controls
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


  /** Submit the form */
  onSubmit() {

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
    if(!catName){return console.log("category is required")}
    const catId = this.categories?.find(c => c.name == catName)?._id;
  
    const data = {
      "productName":    this.productForm.get("productName")?.value,
      "description":    this.productForm.get("productDesc")?.value, 
      "price":          this.productForm.get("productPrice")?.value,
      "discount":       this.productForm.get("productDiscount")?.value,
      "stockQuantity":  this.productForm.get("stocks")?.value,
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
  
