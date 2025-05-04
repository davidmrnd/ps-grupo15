import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isModalOpen: boolean = false;
  resetEmail: string = '';
  modalErrorMessage: string = '';
  
  constructor(private authService: AuthService) {}

  login() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, completa todos los campos.';
      return;
    }

    this.authService.login(this.email, this.password)
      .then(() => {
        window.location.href = '/';
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

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.resetEmail = '';
    this.modalErrorMessage = '';
  }

  sendPasswordReset() {
    if (!this.resetEmail) {
      this.modalErrorMessage = 'Por favor, introduce un correo válido.';
      return;
    }

    this.authService.recoverPassword(this.resetEmail)
      .then(() => {
        alert('Se ha enviado un correo para restablecer tu contraseña.');
        this.closeModal();
      })
      .catch(error => {
        this.modalErrorMessage = error.message;
      });
  }
}
