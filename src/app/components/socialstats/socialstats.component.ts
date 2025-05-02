import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-socialstats',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './socialstats.component.html',
  styleUrls: ['./socialstats.component.css']
})
export class SocialstatsComponent implements OnInit {
  userid: string = '';
  followerlist: { id: string; name: string }[] = [];
  followinglist: { id: string; name: string }[] = [];
  followers: number = 0;
  following: number = 0;
  valorations: number = 0;

  showFollowersDropdown: boolean = false;
  showFollowingDropdown: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userid = params['id'];
      if (this.userid) {
        this.loadSocialStats();
      }
    });
  }

  loadSocialStats(): void {
    this.dataService.getUsersById(this.userid).subscribe((user: any) => {
      if (user) {
        this.followers = user.followers?.length || 0;
        this.following = user.following?.length || 0;
        this.dataService.getCommentsByUserId(this.userid).subscribe((comments: any) => {
          user.comments = comments || [];
          this.valorations = user.comments.length;
        });

        this.loadUserList(user.followers, this.followerlist);
        this.loadUserList(user.following, this.followinglist);
      }
    });
  }

  toggleFollowersDropdown(): void {
    this.showFollowersDropdown = !this.showFollowersDropdown;
  }

  toggleFollowingDropdown(): void {
    this.showFollowingDropdown = !this.showFollowingDropdown;
  }

  loadUserList(ids: string[], list: { id: string; name: string }[]): void {
    list.length = 0; // Clear the list
    if (ids) {
      ids.forEach(id => {
        this.dataService.getUsersById(id).subscribe((user: any) => {
          if (user) {
            list.push({ id, name: user.name || 'Unknown User' });
          }
        });
      });
    }
  }

  goToUserProfile(userId: string): void {
    this.router.navigate(['/user'], { queryParams: { id: userId } });
    this.showFollowersDropdown = false;
    this.showFollowingDropdown = false;
  }
}
