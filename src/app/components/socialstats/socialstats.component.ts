import {Component, inject, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-socialstats',
  imports: [CommonModule, TranslatePipe],
  standalone: true,
  templateUrl: './socialstats.component.html',
  styleUrls: ['./socialstats.component.css']
})
export class SocialstatsComponent implements OnInit {
  @Input() followerList: { id: string; name: string }[] = [];
  @Input() followingList: { id: string; name: string }[] = [];
  @Input() valorations: number = 0;

  showFollowersDropdown: boolean = false;
  showFollowingDropdown: boolean = false;

  private router: Router = inject(Router)

  constructor() {}

  ngOnInit(): void {}

  toggleFollowersDropdown(): void {
    this.showFollowersDropdown = !this.showFollowersDropdown;
  }

  toggleFollowingDropdown(): void {
    this.showFollowingDropdown = !this.showFollowingDropdown;
  }

  goToUserProfile(userId: string): void {
    this.router.navigate(['/user', userId]);
    this.showFollowersDropdown = false;
    this.showFollowingDropdown = false;
  }
}
