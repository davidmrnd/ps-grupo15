import { Component } from '@angular/core';
import {ProfileComponent} from "../../components/profile/profile.component";
import {SocialstatsComponent} from "../../components/socialstats/socialstats.component";
import {CommentariesComponent} from '../../components/commentaries/commentaries.component';
import {StarsComponent} from '../../components/stars/stars.component';

@Component({
  selector: 'app-user-page',
  imports: [
    ProfileComponent,
    SocialstatsComponent,
    CommentariesComponent,
    StarsComponent
  ],
  templateUrl: './userprofile-page.component.html',
  styleUrl: './userprofile-page.component.css'
})
export class UserPageComponent {

}
