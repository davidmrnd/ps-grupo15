import { Component } from '@angular/core';
import {ProfileComponent} from '../../components/profile/profile.component';
import {StarsComponent} from '../../components/stars/stars.component';
import {CommentariesComponent} from '../../components/commentaries/commentaries.component';

@Component({
  selector: 'app-videogameprofile-page',
  imports: [
    ProfileComponent,
    StarsComponent,
    CommentariesComponent
  ],
  templateUrl: './videogameprofile-page.component.html',
  styleUrls: ['./videogameprofile-page.component.css']
})
export class VideogamePageComponent {}
