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

  constructor(private authService: AuthService) {}

  login() {
    this.authService.login(this.email, this.password)
      .then(() => {
        document.body.innerHTML = '<div style="font-size: 8rem; text-align: center;">✅</div>';
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      })
      .catch(error => {
        this.errorMessage = error.message;
      });
  }
}
