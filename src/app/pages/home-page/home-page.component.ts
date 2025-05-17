import { Component } from '@angular/core';
import {WelcomeComponent} from "../../components/welcome/welcome.component";
import { CarouselComponent } from "../../components/carousel/carousel.component";
import { RouterLink } from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-home-page',
  imports: [
    WelcomeComponent,
    CarouselComponent,
    RouterLink,
    TranslatePipe
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

}
