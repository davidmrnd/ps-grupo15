import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
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
    this.authService.login(this.email, this.password)
      .then(() => {
        // Redirigir al usuario después del inicio de sesión
        window.location.href = '/';
      })
      .catch(error => {
        this.errorMessage = error.message;
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
