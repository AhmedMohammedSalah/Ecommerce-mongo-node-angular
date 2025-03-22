import { CommonModule } from '@angular/common';
import { HttpClient, httpResource } from '@angular/common/http';
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
      productName:    ['', [req, min(2), max(40)]],
      productDesc:    ['', [req, min(2), max(100)]],
      stocks:         [0, min(0)],
      productPrice:   [0, [req, min(0)]],
      productDiscount:[0,[min(0), max(100)]]
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
    
  }
}
