import { Component } from '@angular/core';
import { HeroComponent } from "../hero/hero.component";
import { ProductsComponent } from '../products-manager/products/products.component';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-home',
  imports: [HeroComponent, ProductsComponent, HeaderComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}


