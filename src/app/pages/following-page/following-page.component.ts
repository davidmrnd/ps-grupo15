import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
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
  groupedComments: any[] = [];

  constructor(private authService: AuthService, private dataService: DataService) {}

  ngOnInit(): void {
    this.authService.getCurrentUserObservable().subscribe((user) => {
      if (user) {
        this.dataService.getFollowingComments(user.uid).subscribe((comments) => {
          const grouped = comments.reduce((acc: any, comment: any) => {
            const userId = comment.userId;
            if (!acc[userId]) {
              acc[userId] = {
                username: comment.user?.username,
                profileicon: comment.user?.profileicon,
                comments: [],
              };
            }
            acc[userId].comments.push(comment);
            return acc;
          }, {});

          this.groupedComments = Object.values(grouped);
        });
      }
    });
  }

  moveCarousel(username: string, direction: 'prev' | 'next'): void {
    const carouselTrack = document.querySelector(`.carousel-track[data-username="${username}"]`) as HTMLElement;

    if (!carouselTrack) {
      console.error(`Carousel track for user "${username}" not found.`);
      return;
    }

    const slideWidth = carouselTrack.firstElementChild?.clientWidth || 0;
    const currentTransform = parseFloat(
      getComputedStyle(carouselTrack).transform.split(',')[4] || '0'
    );

    const maxTransform = -(slideWidth * (carouselTrack.children.length - 1)); // Total width of all slides minus one visible slide

    let newTransform = currentTransform;

    if (direction === 'prev') {
      newTransform = Math.min(currentTransform + slideWidth, 0); // Prevent moving beyond the first slide
    } else if (direction === 'next') {
      newTransform = Math.max(currentTransform - slideWidth, maxTransform); // Prevent moving beyond the last slide
    }

    carouselTrack.style.transform = `translateX(${newTransform}px)`;
  }
}
