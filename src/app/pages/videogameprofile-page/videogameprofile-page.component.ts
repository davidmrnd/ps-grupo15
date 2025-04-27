import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { ProfileComponent } from '../../components/profile/profile.component';
import { StarsComponent } from '../../components/stars/stars.component';
import { CommentariesComponent } from '../../components/commentaries/commentaries.component';
import { AuthService } from '../../services/auth.service';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';

@Component({
  selector: 'app-videogameprofile-page',
  templateUrl: './videogameprofile-page.component.html',
  styleUrls: ['./videogameprofile-page.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ProfileComponent,
    StarsComponent,
    CommentariesComponent
  ]
})
export class VideogamePageComponent implements OnInit {
  comments: any[] = [];
  averageRating: number = 0;
  videogameId!: string;
  userId: string = '';
  hasComment: boolean = false; // Indica si el usuario ya tiene un comentario

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private authService: AuthService,
    private firestore: Firestore
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.videogameId = params['id'];
      if (this.videogameId) {
        this.loadComments();
        this.checkIfUserHasComment();
      }
    });
  }

  loadComments(): void {
    this.dataService.getCommentsByVideogameId(this.videogameId).subscribe(comments => {
      this.comments = comments;
      this.calculateAverage();
    });
  }

  calculateAverage(): void {
    if (!this.comments.length) {
      this.averageRating = 0;
      return;
    }
    const total = this.comments.reduce((sum, c) => sum + c.rating, 0);
    this.averageRating = Math.round(total / this.comments.length);
  }

  async checkIfUserHasComment(): Promise<void> {
    this.authService.getCurrentUserObservable().subscribe(async (user) => {
      if (user) {
        this.userId = user.uid;

        const commentsCollection = collection(this.firestore, 'comments');
        const q = query(
          commentsCollection,
          where('userId', '==', this.userId),
          where('videogameId', '==', this.videogameId)
        );

        const querySnapshot = await getDocs(q);
        this.hasComment = !querySnapshot.empty; // Si hay resultados, el usuario ya tiene un comentario
      }
    });
  }

  navigateToAddComment() {
    this.authService.getCurrentUserObservable().subscribe((user) => {
      if (user === null) {
        // Si el usuario no ha iniciado sesión, redirige a la página de login
        window.location.href = '/login';
      } else {
        // Si el usuario ha iniciado sesión, redirige a la página de newcoment
        window.location.href = '/newcoment?id=' + this.videogameId;
      }
    });
  }
}
