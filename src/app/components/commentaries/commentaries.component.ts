import {Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { StarsComponent } from '../stars/stars.component';
import {AuthService} from '../../services/auth.service';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import { Firestore, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import {Subscription} from 'rxjs';
import {marker as _} from '@colsen1991/ngx-translate-extract-marker';

@Component({
  selector: 'app-commentaries',
  standalone: true,
  imports: [CommonModule, StarsComponent, RouterLink, TranslatePipe],
  templateUrl: './commentaries.component.html',
  styleUrls: ['./commentaries.component.css']
})
export class CommentariesComponent implements OnInit, OnDestroy {
  @Input() type: string = '';
  @Input() comments: any[] = [];
  id!: string;
  currentUserId: string | null = null;
  private videogameSlug: string = "";
  selectedCommentToDelete: any = null;

  private authService: AuthService = inject(AuthService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private firestore: Firestore = inject(Firestore);
  private translate: TranslateService = inject(TranslateService);

  private translationSubscription: Subscription | undefined;
  private shouldLogInMessage = 'Debes iniciar sesión para dar like.';

  constructor() {}

  ngOnInit(): void {
    this.translationSubscription = this.translate.stream(_("commentaries.alert.should_log_in"))
      .subscribe((translation: string) => {
        this.shouldLogInMessage = translation;
      });
    this.authService.getCurrentUserObservable().subscribe((user) => {
      this.currentUserId = user ? user.uid : null;
    });

    this.route.params.subscribe(params => {
      this.videogameSlug = params["slug"];
    });
  }

  ngOnDestroy(): void {
    if (this.translationSubscription) {
      this.translationSubscription.unsubscribe();
    }
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

  toggleLike(comment: any): void {
    if (!this.currentUserId) {
      alert(this.shouldLogInMessage);
      return;
    }

    const commentDoc = doc(this.firestore, 'comments', comment.id);

    if (comment.likes?.includes(this.currentUserId)) {
      comment.likes = comment.likes.filter((id: string) => id !== this.currentUserId);
    } else {
      comment.likes = [...(comment.likes || []), this.currentUserId];
    }

    updateDoc(commentDoc, { likes: comment.likes }).catch((error) => {
      console.error('Error al actualizar los likes:', error);
    });
  }

  showDeleteModal(comment: any): void {
    this.selectedCommentToDelete = comment;
  }

  confirmDelete(): void {
    if (!this.selectedCommentToDelete) {
      return;
    }

    const commentDoc = doc(this.firestore, 'comments', this.selectedCommentToDelete.id);
    deleteDoc(commentDoc)
      .then(() => {
        this.comments = this.comments.filter(c => c.id !== this.selectedCommentToDelete.id);
        this.selectedCommentToDelete = null;
      })
      .catch(error => {
        console.error('Error al eliminar el comentario:', error);
      });
  }

  cancelDelete(): void {
    this.selectedCommentToDelete = null;
  }
}
