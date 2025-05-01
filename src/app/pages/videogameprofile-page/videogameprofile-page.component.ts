import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { ProfileComponent } from '../../components/profile/profile.component';
import { StarsComponent } from '../../components/stars/stars.component';
import { CommentariesComponent } from '../../components/commentaries/commentaries.component';
import { AuthService } from '../../services/auth.service';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'app-videogameprofile-page',
  templateUrl: './videogameprofile-page.component.html',
  styleUrls: ['./videogameprofile-page.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ProfileComponent,
    StarsComponent,
    CommentariesComponent
  ]
})
export class VideogamePageComponent implements OnInit {
  comments: any[] = [];
  averageRating: number = 0;
  videogameId!: string;
  private videogameSlug!: string | null;
  protected gameInfo: any;
  protected gameCover!: string;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private authService: AuthService,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.videogameSlug = this.route.snapshot.paramMap.get("slug");
    if (this.videogameSlug) {
      this.apiService.getVideogameProfileFromSlug(this.videogameSlug).subscribe((response) => {
        this.gameInfo = response.apiResponse[0];
        this.videogameId = this.gameInfo.id.toString();

        this.apiService.getCoverURL(parseInt(this.videogameId), "cover_big").subscribe((response) => {
          this.gameCover = response.fullURL;
        });
        this.loadComments();
      });
    }
  }

  loadComments(): void {
    this.dataService.getCommentsByVideogameId(this.videogameId).subscribe(comments => {
      this.comments = [];
      this.calculateAverage(comments)

      for (let comment of comments) {
        this.dataService.getUsersById(comment.userId).subscribe(user => {
          comment.user = user;
          console.log(comment);
          this.comments.push(comment);
        });
      }
    });
  }

  calculateAverage(comments: any[]): void {
    if (!comments.length) {
      this.averageRating = 0;
      return;
    }
    const total = comments.reduce((sum, c) => sum + c.rating, 0);
    this.averageRating = Math.round(total / comments.length);
  }

  navigateToAddComment() {
    this.authService.getCurrentUserObservable().subscribe((user) => {
      if (user === null) {
        window.location.href = '/login';
      } else {
        window.location.href = '/newcoment?id=' + this.videogameId;
      }
    });
  }

}
