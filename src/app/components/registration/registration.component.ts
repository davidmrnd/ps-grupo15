import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-registration',
  imports: [FormsModule, CommonModule, RouterModule],
  standalone: true,
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  email: string = '';
  password: string = '';
  name: string = '';
  username: string = '';
  errorMessage: string = '';
  termsAccepted: boolean = false;

  constructor(private authService: AuthService) {}

  register() {
    if (!this.termsAccepted) {
      this.errorMessage = 'Debes aceptar los términos y condiciones.';
      return;
    }

    if (!this.email || !this.password || !this.name || !this.username) {
      this.errorMessage = 'Por favor, completa todos los campos.';
      return;
    }

    this.authService.register(this.email, this.password, this.name, this.username)
      .then(() => {
        document.body.innerHTML = '<div style="font-size: 8rem; text-align: center;">✅</div>';
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);

        this.email = '';
        this.password = '';
        this.name = '';
        this.username = '';
        this.termsAccepted = false;
        this.errorMessage = '';
      })
      .catch(error => {
        this.errorMessage = error.message || 'Ocurrió un error. Inténtalo de nuevo.';
      });
  }

  onPoliciesClick() {
    termsAccepted: true;
  }
}
