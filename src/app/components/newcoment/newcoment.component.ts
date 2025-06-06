import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {RouterModule, Router, ActivatedRoute} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { StarsComponent } from '../stars/stars.component';
import { Firestore, collection, query, where, getDocs, updateDoc, doc, addDoc, deleteDoc } from '@angular/fire/firestore';
import {ApiService} from '../../services/api.service';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {marker as _} from '@colsen1991/ngx-translate-extract-marker';
import {Subscription} from 'rxjs';
import {StorageService} from '../../services/storage.service';

@Component({
  selector: 'app-newcoment',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, StarsComponent, TranslatePipe],
  templateUrl: './newcoment.component.html',
  styleUrls: ['./newcoment.component.css']
})
export class NewcomentComponent implements OnInit, OnDestroy {
  user: any = null;
  commentContent: string = '';
  rating: number = 0;
  videogameId: string = "";
  private videogameSlug: string = "";
  existingCommentId: string | null = null;
  message: string = '';
  showDeleteConfirmation: boolean = false;

  private authService: AuthService = inject(AuthService);
  private dataService: DataService = inject(DataService);
  private firestore: Firestore = inject(Firestore);
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private apiService: ApiService = inject(ApiService);
  private translate: TranslateService = inject(TranslateService);
  private storageService: StorageService = inject(StorageService);

  protected modifyCommentText = "new_comment.modify_comment";
  protected sendCommentText = "new_comment.send_comment";

  private translateSubscription: Subscription | undefined;
  private successfullyDeletedCommentMessage = 'new_comment.messages.successfully_deleted';
  private genericDeletionErrorMessage = 'new_comment.messages.generic_deletion_error';
  private completeAllFieldsMessage = 'new_comment.messages.complete_all_fields';
  private moreThan500CharactersMessage = 'new_comment.messages.more_than_500_characters';
  private successfullyUpdatedMessage = 'new_comment.messages.successfully_updated';
  private successfullySentMessage = 'new_comment.messages.successfully_sent';
  private genericSendingErrorMessage = 'Hubo un error al enviar el comentario. Inténtalo de nuevo.';

  constructor() {}

  ngOnInit(): void {
    this.translateSubscription = this.translate.stream(_([
      "new_comment.messages.generic_sending_message"
    ])).subscribe((translations: {[key: string]: string}) => {
      this.genericSendingErrorMessage = translations["new_comment.messages.generic_sending_message"];
    });

    this.route.params.subscribe(params => {
      this.videogameSlug = params["slug"];
    });
    this.apiService.getVideogameProfileFromSlug(this.videogameSlug).subscribe((response) => {
      this.videogameId = response.apiResponse[0].id.toString();
      this.authService.getCurrentUserObservable().subscribe((user) => {
        if (user) {
          this.dataService.getUsersById(user.uid).subscribe((userData) => {
            this.user = userData;
            this.setProfileIcon();
            this.checkExistingComment();
          });
        }
      });
    });
  }

  ngOnDestroy() {
    if (this.translateSubscription) {
      this.translateSubscription.unsubscribe();
    }
  }

  private setProfileIcon() {
    const localImage = this.storageService.getItem(`profile-image-${this.user.id}`);
    if (localImage){
      this.user.profileicon = localImage;
    }
    this.user.profileicon
  }

  async checkExistingComment(): Promise<void> {
    const commentsCollection = collection(this.firestore, 'comments');
    const q = query(
      commentsCollection,
      where('userId', '==', this.user?.id),
      where('videogameId', '==', this.videogameId)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const existingComment = querySnapshot.docs[0];
      this.existingCommentId = existingComment.id;
      const data = existingComment.data();
      this.commentContent = data['content'];
      this.rating = data['rating'];
    }
  }

  async submitComment(): Promise<void> {
    if (!this.commentContent || this.rating === 0 || !this.videogameId) {
      this.message = this.completeAllFieldsMessage;
      return;
    }

    if (this.commentContent.length > 500) {
      this.message = this.moreThan500CharactersMessage;
      return;
    }

    const newComment = {
      userId: this.user?.id,
      videogameId: this.videogameId,
      content: this.commentContent,
      rating: this.rating,
      createdAt: new Date().toISOString(),
      likes: []
    };

    try {
      const commentsCollection = collection(this.firestore, 'comments');

      if (this.existingCommentId) {
        const commentDoc = doc(this.firestore, 'comments', this.existingCommentId);
        await updateDoc(commentDoc, newComment);
        this.message = this.successfullyUpdatedMessage;
      } else {
        await addDoc(commentsCollection, newComment);
        this.message = this.successfullySentMessage;
      }

      this.router.navigate(['/videogame', this.videogameSlug]);

      this.commentContent = '';
      this.rating = 0;
    } catch (error) {
      console.error('Error al enviar el comentario:', error);
      alert(this.genericSendingErrorMessage);
    }
  }

  async deleteComment(): Promise<void> {
    if (!this.existingCommentId) {
      console.error('No hay un comentario existente para eliminar.');
      return;
    }

    this.showDeleteConfirmation = true;
  }

  async confirmDelete(): Promise<void> {
    try {
      const commentDoc = doc(this.firestore, 'comments', this.existingCommentId!);
      await deleteDoc(commentDoc);
      this.message = this.successfullyDeletedCommentMessage;
      this.router.navigate(['/videogame', this.videogameSlug]);
    } catch (error) {
      console.error('Error al eliminar el comentario:', error);
      this.message = this.genericDeletionErrorMessage;
    } finally {
      this.showDeleteConfirmation = false;
    }
  }

  cancelDelete(): void {
    this.showDeleteConfirmation = false;
  }
}
