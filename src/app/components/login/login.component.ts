import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms'; // Importación necesaria para ngModel
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true, // Indica que es un componente independiente
  imports: [FormsModule, CommonModule, RouterModule], // Asegúrate de incluir FormsModule aquí
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService) {}

  login() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, completa todos los campos.';
      return;
    }

    this.authService.login(this.email, this.password)
      .then(() => {
        document.body.innerHTML = '<div style="font-size: 8rem; text-align: center;">✅</div>';
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
        this.email = '';
        this.password = '';
        this.errorMessage = '';
      })
      .catch(error => {
        if (error.code === 'auth/user-not-found') {
          this.errorMessage = 'Usuario no encontrado.';
        } else if (error.code === 'auth/wrong-password') {
          this.errorMessage = 'Contraseña incorrecta.';
        } else {
          this.errorMessage = 'Ocurrió un error. Inténtalo de nuevo.';
        }
      });
  }
}
