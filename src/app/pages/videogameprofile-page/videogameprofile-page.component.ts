import { Component } from '@angular/core';
import {ProfileComponent} from '../../components/profile/profile.component';
import {StarsComponent} from '../../components/stars/stars.component';

@Component({
  selector: 'app-videogameprofile-page',
  imports: [
    ProfileComponent,
    StarsComponent
  ],
  templateUrl: './videogameprofile-page.component.html',
  styleUrls: ['./videogameprofile-page.component.css']
})
export class VideogamePageComponent {}
