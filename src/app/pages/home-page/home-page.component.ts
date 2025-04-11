import { Component } from '@angular/core';
import {WelcomeComponent} from "../../components/welcome/welcome.component";

@Component({
  selector: 'app-home-page',
  imports: [
    WelcomeComponent,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

}
