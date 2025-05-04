import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { DataService } from '../../services/data.service';
import { StarsComponent } from '../stars/stars.component';
import {ApiService} from '../../services/api.service';
import {AuthService} from '../../services/auth.service';

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
  currentUserId: string | null = null;
  private videogameSlug: string = "";

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Obtener el ID del usuario autenticado
    this.authService.getCurrentUserObservable().subscribe((user) => {
      this.currentUserId = user ? user.uid : null;
    });

    this.route.params.subscribe(params => {
      this.videogameSlug = params["slug"];
    });
  }

  showReleaseYear(releaseDate: number) {
    return !isNaN(releaseDate)
  }

  navigateToEditCommentFromUserProfile(slug: string): void {
    this.router.navigate(['/new-comment', slug]);
  }

  navigateToEditCommentFromVideogame() {
    this.router.navigate(['/new-comment', this.videogameSlug]);
  }

  getSortedComments(): any[] {
    if (!this.comments || !this.currentUserId) {
      return this.comments;
    }

    return this.comments.sort((a, b) => {
      if (a.userId === this.currentUserId) {
        return -1;
      }
      if (b.userId === this.currentUserId) {
        return 1;
      }
      return 0;
    });
  }
}
