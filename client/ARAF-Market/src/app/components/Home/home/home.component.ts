import { Component } from '@angular/core';
import { HeroComponent } from "../hero/hero.component";
import { TestCorsComponent } from "../../others/test-cors/test-cors.component";

@Component({
  selector: 'app-home',
  imports: [HeroComponent, TestCorsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
