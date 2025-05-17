import {Component, inject, OnInit} from '@angular/core';
import { ProfileComponent } from "../../components/profile/profile.component";
import { SocialstatsComponent } from "../../components/socialstats/socialstats.component";
import { CommentariesComponent } from '../../components/commentaries/commentaries.component';
import { AuthService } from '../../services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import { Firestore, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from '@angular/fire/firestore';
import {DataService} from '../../services/data.service';
import {ApiService} from '../../services/api.service';
import {Subscription} from 'rxjs';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-user-page',
  imports: [
    ProfileComponent,
    SocialstatsComponent,
    CommentariesComponent,
    CommonModule,
    TranslatePipe
  ],
  templateUrl: './userprofile-page.component.html',
  styleUrl: './userprofile-page.component.css'
})
export class UserPageComponent implements OnInit {
  isCurrentUserProfile: boolean = false;
  viewedProfileId!: string;
  isFollowing: boolean = false; // New property to track follow status
  protected comments: any[] = [];
  showErrorMessage: boolean = false;
  protected currentUser: any;

  protected valorations: number = 0;
  followerList: { id: string; name: string }[] = [];
  followingList: { id: string; name: string }[] = [];

  private authService: AuthService = inject(AuthService);
  private firestore: Firestore = inject(Firestore);
  private dataService: DataService = inject(DataService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private apiService: ApiService = inject(ApiService);
  private router: Router = inject(Router);

  private userSubscription!: Subscription;

  constructor() {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.viewedProfileId = params['id'];
      this.authService.getCurrentUserObservable().subscribe(async (user) => {
        if (user) {
          this.isCurrentUserProfile = user.uid === this.viewedProfileId;

          if (!this.isCurrentUserProfile) {
            // Check if the current user is following the viewed user
            const userDoc = await getDoc(doc(this.firestore, `users/${user.uid}`));
            const userData = userDoc.data();
            this.isFollowing = userData?.['following']?.includes(this.viewedProfileId) || false; // Use bracket notation
          }
        }

        if (this.userSubscription) {
          this.userSubscription.unsubscribe();
        }

        this.userSubscription = this.dataService.getUsersById(this.viewedProfileId).subscribe((user) => {
          if (user) {
            this.showErrorMessage = false;
            this.currentUser = user;
            this.dataService.getCommentsByUserId(this.viewedProfileId).subscribe((comments: any) => {
              user.comments = comments || [];
              this.valorations = user.comments.length;
            });

            this.loadUserList(user.followers, "followers");
            this.loadUserList(user.following, "following");
          }
          else {
            this.showErrorMessage = true;
          }
        });

        this.dataService.getCommentsByUserId(this.viewedProfileId).subscribe((comments) => {
          this.comments = comments;

          const idList = []
          for(let comment of this.comments) {
            idList.push(comment.videogameId);
          }

          this.apiService.getVideogameInfoForCorouselAndUserProfile(idList).subscribe((response) => {
            for (const comment of this.comments) {
              const videogameData = response.apiResponse[0].result;
              const coverData = response.apiResponse[1].result;
              comment.videogame = videogameData.find((v: any) => v.id.toString() === comment.videogameId);
              const videogameCover = coverData.find((v: any) => v.game.toString() === comment.videogameId);
              comment.videogame.cover = `https://images.igdb.com/igdb/image/upload/t_cover_big/${videogameCover.image_id}.jpg`;
              comment.videogame.year = this.apiService.getReleaseYear(comment.videogame.first_release_date);
            }
          });
        });
      });
    });
  }

  logout() {
    this.authService.logout().then(() => {
      window.location.href = '/';
    });
  }

  followUser(): void {
    this.authService.getCurrentUserObservable().subscribe((user) => {
      if (!user || !this.viewedProfileId) {
        window.location.href = '/login';
        return;
      }

      const currentUserId = user.uid;

      const updates = [
        updateDoc(doc(this.firestore, `users/${currentUserId}`), {
          following: arrayUnion(this.viewedProfileId)
        }),
        updateDoc(doc(this.firestore, `users/${this.viewedProfileId}`), {
          followers: arrayUnion(currentUserId)
        })
      ];

      Promise.all(updates)
        .then(() => {
          console.log('Follow action completed successfully');
          this.isFollowing = true; // Update the state
        })
        .catch((error) => console.error('Error updating follow data:', error));
    });
  }

  unfollowUser(): void {
    this.authService.getCurrentUserObservable().subscribe((user) => {
      if (!user || !this.viewedProfileId) {
        window.location.href = '/login';
        return;
      }

      const currentUserId = user.uid;

      const updates = [
        updateDoc(doc(this.firestore, `users/${currentUserId}`), {
          following: arrayRemove(this.viewedProfileId)
        }),
        updateDoc(doc(this.firestore, `users/${this.viewedProfileId}`), {
          followers: arrayRemove(currentUserId)
        })
      ];

      Promise.all(updates)
        .then(() => {
          console.log('Unfollow action completed successfully');
          this.isFollowing = false; // Update the state
        })
        .catch((error) => console.error('Error updating unfollow data:', error));
    });
  }

  navigateToRoot() {
    this.router.navigate(['/']);
  }

  loadUserList(ids: string[], list: string): void {
    const newList = ids.map((id) => {
      return {id: id, name: ""};
    });

    for (const listElement of newList) {
      this.dataService.getUsersById(listElement.id).subscribe((user) => {
        if (user) {
          listElement.name = user.name;
        }
      });
    }

    if (list === "followers") {
      this.followerList = newList;
    }
    else {
      this.followingList = newList;
    }
  }
}
