import {Component, inject, AfterViewInit} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {DataService} from '../../services/data.service';

declare var grecaptcha: any;

interface GrecaptchaWindow extends Window {
  grecaptcha?: any;
}
declare const window: GrecaptchaWindow;

@Component({
  selector: 'app-registration',
  imports: [FormsModule, CommonModule, RouterModule],
  standalone: true,
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements AfterViewInit {
  email: string = '';
  password: string = '';
  name: string = '';
  username: string = '';
  errorMessage: string = '';
  termsAccepted: boolean = false;
  siteKey: string = '6Lf5Xz0rAAAAAPiAcDxFX5clDaNiwY72_M0zfpxD';
  captchaError: string = '';

  private authService: AuthService = inject(AuthService);
  private dataService: DataService = inject(DataService);

  constructor() {}

  ngAfterViewInit() {
    // Espera a que el DOM esté listo y renderiza el captcha
    if (window['grecaptcha']) {
      window['grecaptcha'].render(document.querySelector('.g-recaptcha'), {
        'sitekey': this.siteKey
      });
    }
  }

  register() {
    if (!this.termsAccepted) {
      this.errorMessage = 'Debes aceptar los términos y condiciones.';
      return;
    }

    if (!this.email || !this.password || !this.name || !this.username) {
      this.errorMessage = 'Por favor, completa todos los campos.';
      return;
    }

    // Validación del captcha
    const captchaResponse = (document.querySelector('.g-recaptcha-response') as HTMLInputElement)?.value;
    if (!captchaResponse) {
      this.captchaError = 'Por favor, verifica que no eres un robot.';
      return;
    } else {
      this.captchaError = '';
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
          this.captchaError = '';
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
