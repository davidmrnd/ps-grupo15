import { Component, OnInit } from '@angular/core';
import { ProfileComponent } from "../../components/profile/profile.component";
import { SocialstatsComponent } from "../../components/socialstats/socialstats.component";
import { CommentariesComponent } from '../../components/commentaries/commentaries.component';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Firestore, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from '@angular/fire/firestore';

@Component({
  selector: 'app-user-page',
  imports: [
    ProfileComponent,
    SocialstatsComponent,
    CommentariesComponent,
    CommonModule
  ],
  templateUrl: './userprofile-page.component.html',
  styleUrl: './userprofile-page.component.css'
})
export class UserPageComponent implements OnInit {
  isCurrentUserProfile: boolean = false;
  viewedProfileId!: string;
  isFollowing: boolean = false; // New property to track follow status

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private firestore: Firestore
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((queryParams) => {
      this.viewedProfileId = queryParams['id'];
      this.authService.getCurrentUserObservable().subscribe(async (user) => {
        if (user) {
          this.isCurrentUserProfile = user.uid === this.viewedProfileId;

          // Check if the current user is following the viewed user
          const userDoc = await getDoc(doc(this.firestore, `users/${user.uid}`));
          const userData = userDoc.data();
          this.isFollowing = userData?.['following']?.includes(this.viewedProfileId) || false; // Use bracket notation
        }
      });
    });
  }

  logout() {
    this.authService.logout().then(() => {
      window.location.href = '/';
    });
  }

  followUser(): void {
    this.authService.getCurrentUserObservable().subscribe((currentUser) => {
      if (!currentUser || !this.viewedProfileId) {
        window.location.href = '/login';
        return;
      }

      const currentUserId = currentUser.uid;

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
    this.authService.getCurrentUserObservable().subscribe((currentUser) => {
      if (!currentUser || !this.viewedProfileId) {
        window.location.href = '/login';
        return;
      }

      const currentUserId = currentUser.uid;

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
}
