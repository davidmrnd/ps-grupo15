import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registration',
  imports: [FormsModule, CommonModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  email: string = '';
  password: string = '';
  name: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService) {}

  register() {
    this.authService.register(this.email, this.password, this.name)
      .then(() => {
        document.body.innerHTML = '<div style="font-size: 8rem; text-align: center;">✅</div>';
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
      })
      .catch(error => {
        this.errorMessage = error.message;
      });
  }
}
