import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { ProfileComponent } from '../../components/profile/profile.component';
import { StarsComponent } from '../../components/stars/stars.component';
import { CommentariesComponent } from '../../components/commentaries/commentaries.component';

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

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.videogameId = params['id'];
      if (this.videogameId) {
        this.loadComments();
      }
    });
  }

  loadComments(): void {
    this.dataService.getCommentsByVideogameId(this.videogameId).subscribe(comments => {
      this.comments = comments;
      this.calculateAverage();
    });
  }

  calculateAverage(): void {
    if (!this.comments.length) {
      this.averageRating = 0;
      return;
    }
    const total = this.comments.reduce((sum, c) => sum + c.rating, 0);
    this.averageRating = Math.round(total / this.comments.length);
  }

}
