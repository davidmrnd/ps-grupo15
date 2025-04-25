import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { StarsComponent } from '../stars/stars.component';
import { Firestore, collection, addDoc, Timestamp } from '@angular/fire/firestore';

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

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private firestore: Firestore
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
        });
      }
    });
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
      await addDoc(commentsCollection, newComment);
      alert('Comentario enviado con éxito.');
      this.commentContent = ''; // Limpia el campo de texto
      this.rating = 0; // Reinicia las estrellas
    } catch (error) {
      console.error('Error al enviar el comentario:', error);
      alert('Hubo un error al enviar el comentario. Inténtalo de nuevo.');
    }
  }
}