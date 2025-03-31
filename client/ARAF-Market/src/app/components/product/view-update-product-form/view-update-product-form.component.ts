import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, OnChanges, SimpleChanges, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category, CategoryResponse } from '../../../interfaces/categoryInterface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProductService } from '../../../services/API/product.service';
import { CategoryService } from '../../../services/API/category/category.service';

@Component({
  selector: 'app-view-update-product-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './view-update-product-form.component.html',
  styleUrl: './view-update-product-form.component.css'
})

export class ViewUpdateProductFormComponent implements OnInit, OnChanges {


//#region====ATTRIBUTES========================

@Input() product: any; 
@Input() selectedCategory!: string;
@Input() isUpdate: boolean = true; 
@Output() defaultUpdateValue = new EventEmitter<boolean>();

productForm!: FormGroup;
catNames: string[] = [];                  // category names  
categories: Category[] | null = null;     // category objects
imagePreview: string | null = null;       // image
response: any = [];                       // response
//#endregion

//#region====SERVICES========================== 

  http = inject(HttpClient);
  productService = inject(ProductService);   
  fb = inject(FormBuilder);
  categoryService = inject(CategoryService);
//#endregion

//====ONINIT===========================
  ngOnInit() {
    this.getCategories();
    this.initializeForm();
  }

//===ON=CHANGES=========================
  ngOnChanges(changes: SimpleChanges) {
    if (changes['isUpdate']) { this.initializeForm();}
  }

//===METHOD=============================
  //#region 
  initializeForm() {
    const req = Validators.required;
    const min = Validators.minLength;
    const max = Validators.maxLength;
    const minN = Validators.min;
    const maxN = Validators.max;

    // image preview initialization
    this.imagePreview = 'http://localhost:3000/' + this.product.imagePath;

    this.productForm = this.fb.group({
      productImage: [this.product.imagePath, [req]],
      category:       [{ value: "loading...", disabled: this.isUpdate }], 
      productName:    [{ value: this.product.productName, disabled: this.isUpdate }, [req, min(3), max(40)]], 
      productDesc:    [{ value: this.product.description, disabled: this.isUpdate }, [req, min(20), max(100)]], 
      stocks:         [{ value: this.product.stockQuantity, disabled: this.isUpdate }, minN(0)], 
      productPrice:   [{ value: this.product.price, disabled: this.isUpdate }, [req, minN(0)]], 
      productDiscount:[{ value: this.product.discount, disabled: this.isUpdate }, [minN(0), maxN(100)]]
    });



    // get category
    let catName;
    this.categoryService.getCatName(this.product.categoryId).subscribe(res =>{ 
      catName = res.category.name;
      this.productForm.patchValue({category: catName })
    })

  }

  // DESTRUCTOR
  ngOnDestroy() { this.defaultUpdateValue.emit(true); }

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
  
      fileControl?.setValue(file);
      fileControl?.updateValueAndValidity();
  
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        console.log("image preview = ", this.imagePreview); //DEBUG
      };
      reader.readAsDataURL(file);
    }
  }

  // [MAIN METHOD] UPDATE
  onUpdate() {

    // get token + insert it in the header
    const token = localStorage.getItem('token');
    if (!token) { console.error("Token is missing!"); return;}
    let headers = new HttpHeaders({ 'token': token,'enctype': 'multipart/form-data'});

    // get category id for the chosen one
    const catName = this.productForm.get('category')?.value;
    if (!catName) { return console.log("category is required");}
    const catId = this.categories?.find(c => c.name == catName)?._id;

    // collect data
    const data = {
      "productName": this.productForm.get("productName")?.value,
      "description": this.productForm.get("productDesc")?.value,
      "price": this.productForm.get("productPrice")?.value,
      "discount": this.productForm.get("productDiscount")?.value,
      "stockQuantity": this.productForm.get("stocks")?.value,
      "categoryId": catId || ''
    };

    console.log("product image = ", this.productForm.get("productImage")?.value);

    // put them in form-data body
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    formData.append("productImg", this.productForm.get("productImage")?.value);

    console.log("product id = ", this.product._id); //DEBUG

    // use the update service 
    this.http.put(`http://127.0.0.1:3000/products/${this.product._id}`, formData, { headers })
      .subscribe(response => {
        this.response = response;
        if ("msg" in response) { setTimeout(() => { this.response.msg = '' }, 3000);}
      });
  }

  //#endregion
}
