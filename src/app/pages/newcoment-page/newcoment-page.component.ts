import { Component } from '@angular/core';
import { ProfileComponent } from '../../components/profile/profile.component';
import { NewcomentComponent } from "../../components/newcoment/newcoment.component";

@Component({
  selector: 'app-newcoment-page',
  imports: [
    ProfileComponent,
    NewcomentComponent
],
  templateUrl: './newcoment-page.component.html',
  styleUrl: './newcoment-page.component.css'
})
export class NewcomentPageComponent {

}
