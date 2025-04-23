import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { DataService } from '../../services/data.service';
import { StarsComponent } from '../stars/stars.component';

@Component({
  selector: 'app-commentaries',
  standalone: true,
  imports: [CommonModule, StarsComponent, RouterLink],
  templateUrl: './commentaries.component.html',
  styleUrls: ['./commentaries.component.css']
})
export class CommentariesComponent implements OnInit {
  @Input() type: string = '';
  comments: any[] = [];
  id!: string;

  constructor(private dataService: DataService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      if (!this.id) return;

      if (this.type === 'videogame') {
        this.dataService.getCommentsByVideogameId(this.id).subscribe(comments => {
          this.comments = [];

          for (let comment of comments) {
            this.dataService.getUsersById(comment.userId).subscribe(user => {
              comment.user = user;
              console.log(comment);
              this.comments.push(comment);
            });
          }
        });
      } else {
        this.dataService.getCommentsByUserId(this.id).subscribe(comments => {
          this.comments = [];

          for (let comment of comments) {
            this.dataService.getVideogameById(comment.videogameId).subscribe(videogame => {
              comment.videogame = videogame;
              this.comments.push(comment);
            });
          }
        });
      }
    });
  }
}
