import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {DataService} from '../../services/data.service';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {marker as _} from '@colsen1991/ngx-translate-extract-marker';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-registration',
  imports: [FormsModule, CommonModule, RouterModule, TranslatePipe],
  standalone: true,
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit, OnDestroy {
  email: string = '';
  password: string = '';
  name: string = '';
  username: string = '';
  errorMessage: string = '';
  termsAccepted: boolean = false;

  private authService: AuthService = inject(AuthService);
  private dataService: DataService = inject(DataService);
  private translate: TranslateService = inject(TranslateService);

  private translationSubscription: Subscription | undefined;
  private mustAcceptTOSMessage = 'Debes aceptar los términos y condiciones.';
  private completeAllFieldsMessage = 'Por favor, completa todos los campos.';
  private nonAvailableUsernameMessage = 'El nombre de usuario ya está en uso. Por favor, elige otro.';
  private genericErrorMessage = 'Ocurrió un error. Inténtalo de nuevo.';

  constructor() {}

  ngOnInit() {
    this.translationSubscription = this.translate.stream(_([
      "sign_up.must_accept_tos",
      "sign_up.message.complete_all_fields",
      "sign_up.message.non_available_username",
      "sign_up.message.generic_error_message",
    ])).subscribe((translations: {[key:string]: string}) => {
      this.mustAcceptTOSMessage = translations["sign_up.must_accept_tos"];
      this.completeAllFieldsMessage = translations["sign_up.message.complete_all_fields"];
      this.nonAvailableUsernameMessage = translations["sign_up.message.non_available_username"];
      this.genericErrorMessage = translations["sign_up.message.generic_error_message"];
    });
  }

  ngOnDestroy() {
    if (this.translationSubscription) {
      this.translationSubscription.unsubscribe();
    }
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
    this.checkUsernameAvailability(this.username).then((isUsernameAvailable) => {
      if (!isUsernameAvailable) {
        this.errorMessage = this.nonAvailableUsernameMessage;
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
