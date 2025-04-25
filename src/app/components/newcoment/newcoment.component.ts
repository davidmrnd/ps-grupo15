import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { StarsComponent } from '../stars/stars.component'; // Importa el componente de estrellas

@Component({
  selector: 'app-newcoment',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, StarsComponent], // Agrega StarsComponent a los imports
  templateUrl: './newcoment.component.html',
  styleUrls: ['./newcoment.component.css']
})
export class NewcomentComponent implements OnInit {
  user: any = null;
  commentContent: string = ''; 

  constructor(private authService: AuthService, private dataService: DataService) {}

  ngOnInit(): void {
    // Obtener la información del usuario autenticado
    this.authService.getCurrentUserObservable().subscribe((user) => {
      if (user) {
        this.dataService.getUsersById(user.uid).subscribe((userData) => {
          this.user = userData;
        });
      }
    });
  }

  submitComment(): void {
    // Lógica para enviar el comentario
    const newComment = {
      userId: this.user?.id,
      content: this.commentContent,
    };

    console.log('Comentario enviado:', newComment);
    // Aquí puedes llamar a un servicio para guardar el comentario en la base de datos
    // this.dataService.saveComment(newComment).subscribe(response => {
    //   console.log('Comentario guardado:', response);
    // });
  }
}