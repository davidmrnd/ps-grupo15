import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { DataService } from '../../services/data.service';
import { StarsComponent } from '../stars/stars.component';
import { AuthService } from '../../services/auth.service';

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
  currentUserId: string | null = null;

  constructor(private dataService: DataService, private route: ActivatedRoute, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // Obtener el ID del usuario autenticado
    this.authService.getCurrentUserObservable().subscribe((user) => {
      this.currentUserId = user ? user.uid : null;
    });
    
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

  navigateToEditComment(videogameId: string): void {
    this.router.navigate(['/newcoment'], { queryParams: { id: videogameId } });
  }

}
