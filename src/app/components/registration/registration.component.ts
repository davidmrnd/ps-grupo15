import {Component, inject, AfterViewInit} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {DataService} from '../../services/data.service';
import {TranslatePipe} from '@ngx-translate/core';

interface GrecaptchaWindow extends Window {
  grecaptcha?: any;
}
declare const window: GrecaptchaWindow;

@Component({
  selector: 'app-registration',
  imports: [FormsModule, CommonModule, RouterModule, TranslatePipe],
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

  private mustAcceptTOSMessage = 'sign_up.must_accept_tos';
  private completeAllFieldsMessage = 'sign_up.messages.complete_all_fields';
  private nonAvailableUsernameMessage = 'sign_up.messages.non_available_username';
  private genericErrorMessage = 'sign_up.messages.generic_error_message';
  private failedCaptchaMessage = 'sign_up.messages.failed_captcha';
  private weakPasswordMessage: string = 'sign_up.messages.weak_password';

  constructor() {}

  ngAfterViewInit() {
    // Espera a que el DOM esté listo y renderiza el captcha
    if (window['grecaptcha']) {
      window['grecaptcha'].render(document.querySelector('.g-recaptcha'), {
        'sitekey': this.siteKey
      });
    }
  }

  validatePassword(password: string): boolean {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!strongPasswordRegex.test(password)) {
      this.errorMessage = this.weakPasswordMessage;
      return false;
    }
    this.weakPasswordMessage = '';
    return true;
  }

  register() {
    if (!this.termsAccepted) {
      this.errorMessage = this.mustAcceptTOSMessage;
      return;
    }

    if (!this.email || !this.password || !this.name || !this.username) {
      this.errorMessage = this.completeAllFieldsMessage;
      return;
    }

    if (!this.validatePassword(this.password)) {
      return;
    }

    // Validación del captcha
    const captchaResponse = (document.querySelector('.g-recaptcha-response') as HTMLInputElement)?.value;
    if (!captchaResponse) {
      this.captchaError = this.failedCaptchaMessage;
      return;
    } else {
      this.captchaError = '';
    }

    this.checkUsernameAvailability(this.username).then((isUsernameAvailable) => {
      if (!isUsernameAvailable) {
        this.errorMessage = this.nonAvailableUsernameMessage;
        return;
      }
      this.errorMessage = '';
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
          this.errorMessage = error.message || this.genericErrorMessage;
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
