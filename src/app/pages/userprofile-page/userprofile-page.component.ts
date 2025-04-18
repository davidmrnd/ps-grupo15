import { Component, OnInit } from '@angular/core';
import { ProfileComponent } from "../../components/profile/profile.component";
import { SocialstatsComponent } from "../../components/socialstats/socialstats.component";
import { CommentariesComponent } from '../../components/commentaries/commentaries.component';
import { StarsComponent } from '../../components/stars/stars.component';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-page',
  imports: [
    ProfileComponent,
    SocialstatsComponent,
    CommentariesComponent,
    CommonModule,
    StarsComponent
  ],
  templateUrl: './userprofile-page.component.html',
  styleUrl: './userprofile-page.component.css'
})
export class UserPageComponent implements OnInit {
  isCurrentUserProfile: boolean = false;

  constructor(private authService: AuthService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((queryParams) => {
      const viewedProfileId = queryParams['id'];
      this.authService.getCurrentUserObservable().subscribe((user) => {
        this.isCurrentUserProfile = user?.uid === viewedProfileId;
      });
    });
  }

  logout() {
    this.authService.logout().then(() => {
      window.location.href = '/';
    });
  }
}
