import {Component, inject, OnInit} from '@angular/core';
import {RouterModule, Router, ActivatedRoute} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { StarsComponent } from '../stars/stars.component';
import { Firestore, collection, query, where, getDocs, updateDoc, doc, addDoc, deleteDoc } from '@angular/fire/firestore';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'app-newcoment',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, StarsComponent],
  templateUrl: './newcoment.component.html',
  styleUrls: ['./newcoment.component.css']
})
export class NewcomentComponent implements OnInit {
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

  constructor() {}

  ngOnInit(): void {
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

  private setProfileIcon() {
    const localImage = localStorage.getItem(`profile-image-${this.user.id}`);
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
      this.message = 'Por favor, completa todos los campos antes de enviar el comentario.';
      return;
    }

    if (this.commentContent.length > 500) {
      this.message = 'El comentario no debe superar los 500 caracteres.';
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
        this.message = 'Comentario actualizado con éxito.';
      } else {
        await addDoc(commentsCollection, newComment);
        this.message = 'Comentario enviado con éxito.';
      }

      this.router.navigate(['/videogame', this.videogameSlug]);

      this.commentContent = '';
      this.rating = 0;
    } catch (error) {
      console.error('Error al enviar el comentario:', error);
      alert('Hubo un error al enviar el comentario. Inténtalo de nuevo.');
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
      this.message = 'Comentario eliminado con éxito.';
      this.router.navigate(['/videogame', this.videogameSlug]);
    } catch (error) {
      console.error('Error al eliminar el comentario:', error);
      this.message = 'Hubo un error al eliminar el comentario. Inténtalo de nuevo.';
    } finally {
      this.showDeleteConfirmation = false;
    }
  }

  cancelDelete(): void {
    this.showDeleteConfirmation = false;
  }
}
