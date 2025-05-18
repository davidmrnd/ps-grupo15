import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import { marker as _ } from '@colsen1991/ngx-translate-extract-marker';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, TranslatePipe],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isModalOpen: boolean = false;
  resetEmail: string = '';
  modalErrorMessage: string = '';

  private authService: AuthService = inject(AuthService);
  private translate: TranslateService = inject(TranslateService);

  private translationSubscription: Subscription | undefined;
  private completeFieldsMessage: string = "Por favor, completa todos los campos.";
  private userNotFoundMessage: string = "Usuario no encontrado.";
  private wrongPasswordMessage: string = "Contraseña incorrecta.";
  private genericErrorMessage: string = 'Ocurrió un error. Inténtalo de nuevo.';
  private invalidEmailMessage: string = "Por favor, introduce un correo válido.";
  private emailSentMessage = 'Se ha enviado un correo para restablecer tu contraseña.';

  constructor() {}

  ngOnInit() {
    this.translationSubscription = this.translate.stream(_([
      "login.messages.complete_fields",
      "login.messages.user_not_found",
      "login.messages.wrong_password",
      "login.messages.generic",
      "login.messages.invalid_email",
      "login.messages.email_sent"
    ])).subscribe((translations: {[key: string]: string}) => {
      this.completeFieldsMessage = translations["login.messages.complete_fields"];
      this.userNotFoundMessage = translations["login.messages.user_not_found"];
      this.wrongPasswordMessage = translations["login.messages.wrong_password"];
      this.genericErrorMessage = translations["login.messages.generic"];
      this.invalidEmailMessage = translations["login.messages.invalid_email"];
      this.emailSentMessage = translations["login.messages.email_sent"];
    });
  }

  ngOnDestroy() {
    if (this.translationSubscription) {
      this.translationSubscription.unsubscribe();
    }
  }

  login() {
    if (!this.email || !this.password) {
      this.errorMessage = this.completeFieldsMessage;
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
          this.errorMessage = this.userNotFoundMessage;
        } else if (error.code === 'auth/wrong-password') {
          this.errorMessage = this.wrongPasswordMessage;
        } else {
          this.errorMessage = this.genericErrorMessage;
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
      this.modalErrorMessage = this.invalidEmailMessage;
      return;
    }

    this.authService.recoverPassword(this.resetEmail)
      .then(() => {
        alert(this.emailSentMessage);
        this.closeModal();
      })
      .catch(error => {
        this.modalErrorMessage = error.message;
      });
  }
}
