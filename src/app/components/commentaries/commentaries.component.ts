import {Component, inject, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { StarsComponent } from '../stars/stars.component';
import {AuthService} from '../../services/auth.service';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-commentaries',
  standalone: true,
  imports: [CommonModule, StarsComponent, RouterLink, TranslatePipe],
  templateUrl: './commentaries.component.html',
  styleUrls: ['./commentaries.component.css']
})
export class CommentariesComponent implements OnInit {
  @Input() type: string = '';
  @Input() comments: any[] = [];
  id!: string;
  currentUserId: string | null = null;
  private videogameSlug: string = "";

  private authService: AuthService = inject(AuthService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);

  constructor() {}

  ngOnInit(): void {
    // Obtener el ID del usuario autenticado
    this.authService.getCurrentUserObservable().subscribe((user) => {
      this.currentUserId = user ? user.uid : null;
    });

    this.route.params.subscribe(params => {
      this.videogameSlug = params["slug"];
    });
  }
  setProfileIcon(comment: any){
    if (comment.userId === this.currentUserId) {
      const localImage = localStorage.getItem(`profile-image-${comment.userId}`);
      return localImage || comment.user?.profileicon;
    }
    return comment.user?.profileicon;
  }
  showReleaseYear(releaseDate: number) {
    return !isNaN(releaseDate);
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
