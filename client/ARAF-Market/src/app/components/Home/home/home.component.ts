import { Component } from '@angular/core';
import { HeroComponent } from "../hero/hero.component";
import { ProductsComponent } from '../products-manager/products/products.component';

@Component({
  selector: 'app-home',
  imports: [HeroComponent,ProductsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}


