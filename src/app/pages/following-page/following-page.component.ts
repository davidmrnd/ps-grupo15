import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { Subscription } from 'rxjs';
import { StarsComponent } from "../../components/stars/stars.component";
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-following-page',
  templateUrl: './following-page.component.html',
  styleUrls: ['./following-page.component.css'],
  imports: [StarsComponent, CommonModule, RouterLink],
})
export class FollowingPageComponent implements OnInit {
  comments: any[] = [];
  private userSubscription: Subscription | null = null;

  constructor(private authService: AuthService, private dataService: DataService) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.getCurrentUserObservable().subscribe((user) => {
      if (user) {
        this.dataService.getFollowingComments(user.uid).subscribe((comments) => {
          this.comments = [];

          for (let comment of comments) {
            this.dataService.getUsersById(comment.userId).subscribe(user => {
              comment.user = user;
              console.log(comment);
              this.comments.push(comment);
            });
            this.dataService.getVideogameById(comment.videogameId).subscribe(videogame => {
              comment.videogame = videogame;
              this.comments.push(comment);
            });
          }
        });
      }
    });
  }
  
  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
