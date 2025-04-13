import { Component } from '@angular/core';
import {ProfileComponent} from "../../components/profile/profile.component";
import {SocialstatsComponent} from "../../components/socialstats/socialstats.component";

@Component({
  selector: 'app-user-page',
  imports: [
    ProfileComponent,
    SocialstatsComponent
  ],
  templateUrl: './userprofile-page.component.html',
  styleUrl: './userprofile-page.component.css'
})
export class UserPageComponent {

}
