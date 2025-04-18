import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [ CommonModule, RouterLink ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  userName: string | null = null;
  private userSubscription: Subscription | null = null;
  userId: any|string;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userSubscription = this.authService.getCurrentUserObservable().subscribe((user) => {
      this.isLoggedIn = !!user;
      this.userId = user?.uid || null;
    });
  }

  logout() {
    this.authService.logout().then(() => {
      this.isLoggedIn = false;
      this.userName = null;
    });
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
  }
}
