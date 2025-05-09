import {Component, inject} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {DataService} from '../../services/data.service';

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

  private authService: AuthService = inject(AuthService);
  private dataService: DataService = inject(DataService);

  constructor() {}

  register() {
    if (!this.termsAccepted) {
      this.errorMessage = 'Debes aceptar los términos y condiciones.';
      return;
    }

    if (!this.email || !this.password || !this.name || !this.username) {
      this.errorMessage = 'Por favor, completa todos los campos.';
      return;
    }
    this.checkUsernameAvailability(this.username).then((isUsernameAvailable) => {
      if (!isUsernameAvailable) {
        this.errorMessage = 'El nombre de usuario ya está en uso. Por favor, elige otro.';
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
    }).catch(error => {
      console.error('Error al comprobar disponibilidad del nombre de usuario:', error);
    });
  }
  checkUsernameAvailability(username: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.dataService.searchUsername(username).subscribe((existingUsers: any[]) => {
        if (existingUsers.length > 0) {
          resolve(false); // Nombre de usuario no disponible
        } else {
          resolve(true); // Nombre de usuario disponible
        }
      }, (error) => {
        reject(error); // En caso de error en la llamada a la API
      });
    });
  }

  onPoliciesClick() {
    termsAccepted: true;
  }
}
