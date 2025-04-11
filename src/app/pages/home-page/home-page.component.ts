import { Component } from '@angular/core';
import {WelcomeComponent} from "../../components/welcome/welcome.component";
import { CarouselComponent } from "../../components/carousel/carousel.component";

@Component({
  selector: 'app-home-page',
  imports: [
    WelcomeComponent,
    CarouselComponent
],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

}
