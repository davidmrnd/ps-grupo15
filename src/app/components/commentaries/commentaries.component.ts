import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { DataService } from '../../services/data.service';
import { StarsComponent } from '../stars/stars.component';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'app-commentaries',
  standalone: true,
  imports: [CommonModule, StarsComponent, RouterLink],
  templateUrl: './commentaries.component.html',
  styleUrls: ['./commentaries.component.css']
})
export class CommentariesComponent implements OnInit {
  @Input() type: string = '';
  @Input() comments: any[] = [];
  id!: string;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private apiService: ApiService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      if (!this.id) return;

      if (this.type === 'videogame') {} else {
        this.dataService.getCommentsByUserId(this.id).subscribe(comments => {
          this.comments = [];

          for (let comment of comments) {
            this.apiService.getVideogameProfile(comment.videogameId).subscribe(response => {
              comment.videogame = response.apiResponse[0].result[0];
              comment.videogame.cover = `https://images.igdb.com/igdb/image/upload/t_cover_big/${response.apiResponse[1].result[0].image_id}.jpg`
              comment.videogame.year = this.apiService.getReleaseYear(comment.videogame.first_release_date);
              this.comments.push(comment);
            });
          }
        });
      }
    });
  }

  showReleaseYear(releaseDate: number) {
    return !isNaN(releaseDate)
  }
}
