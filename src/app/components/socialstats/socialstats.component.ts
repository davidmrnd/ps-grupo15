import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-socialstats',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './socialstats.component.html',
  styleUrls: ['./socialstats.component.css']
})
export class SocialstatsComponent implements OnInit {
  userid: string = "";
  followers: number = 0;
  following: number = 0;
  valorations: number = 0;

  constructor(
    private route: ActivatedRoute,
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
      if(user){
        if (user.followers) {
          this.followers = user.followers.length;
        } else {
          this.followers = 0;
        }
  
        if (user.following) {
          this.following = user.following.length;
        } else {
          this.following = 0;
        }

        this.dataService.getCommentsByUserId(this.userid).subscribe((comments: any) => {
          user.comments = comments || [];
          this.valorations = user.comments.length;
        });
      }
    });
  }
}
