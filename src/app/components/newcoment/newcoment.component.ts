import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { StarsComponent } from '../stars/stars.component';
import { Firestore, collection, query, where, getDocs, updateDoc, doc, addDoc, deleteDoc } from '@angular/fire/firestore';

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
  videogameId: string = '';
  existingCommentId: string | null = null; // ID del comentario existente, si lo hay

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private firestore: Firestore,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener el ID del videojuego desde los parámetros de la URL
    this.route.queryParams.subscribe((params) => {
      this.videogameId = params['id'];
    });

    // Obtener la información del usuario autenticado
    this.authService.getCurrentUserObservable().subscribe((user) => {
      if (user) {
        this.dataService.getUsersById(user.uid).subscribe((userData) => {
          this.user = userData;
          this.checkExistingComment(); // Verificar si ya existe un comentario
        });
      }
    });
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
      // Si ya existe un comentario, guarda su ID
      const existingComment = querySnapshot.docs[0];
      this.existingCommentId = existingComment.id;
      const data = existingComment.data();
      this.commentContent = data['content']; // Rellenar el contenido existente
      this.rating = data['rating']; // Rellenar la calificación existente
    }
  }

  async submitComment(): Promise<void> {
    if (!this.commentContent || this.rating === 0 || !this.videogameId) {
      alert('Por favor, completa todos los campos antes de enviar el comentario.');
      return;
    }

    const newComment = {
      userId: this.user?.id,
      videogameId: this.videogameId,
      content: this.commentContent,
      rating: this.rating,
      createdAt: new Date().toISOString()
    };

    try {
      const commentsCollection = collection(this.firestore, 'comments');

      if (this.existingCommentId) {
        // Si ya existe un comentario, actualízalo
        const commentDoc = doc(this.firestore, 'comments', this.existingCommentId);
        await updateDoc(commentDoc, newComment);
        alert('Comentario actualizado con éxito.');
      } else {
        // Si no existe un comentario, crea uno nuevo
        await addDoc(commentsCollection, newComment);
        alert('Comentario enviado con éxito.');
      }

      // Redirige a la página del videojuego
      this.router.navigate(['/videogameprofile'], { queryParams: { id: this.videogameId } });

      // Limpia los campos
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
  
    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar este comentario?');
    if (!confirmDelete) {
      // Si el usuario cancela, no se realiza ninguna acción
      return;
    }

    try {
      const commentDoc = doc(this.firestore, 'comments', this.existingCommentId);
      await deleteDoc(commentDoc); // Elimina el comentario de la base de datos
      alert('Comentario eliminado con éxito.');
  
      // Redirige a la página del videojuego después de eliminar
      this.router.navigate(['/videogameprofile'], { queryParams: { id: this.videogameId } });
    } catch (error) {
      console.error('Error al eliminar el comentario:', error);
      alert('Hubo un error al eliminar el comentario. Inténtalo de nuevo.');
    }
  }
}