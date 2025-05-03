import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { ProfileComponent } from '../../components/profile/profile.component';
import { StarsComponent } from '../../components/stars/stars.component';
import { CommentariesComponent } from '../../components/commentaries/commentaries.component';
import { AuthService } from '../../services/auth.service';
import {ApiService} from '../../services/api.service';
import {collection, Firestore, getDocs, query, where} from '@angular/fire/firestore';

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
  private videogameSlug!: string | null;
  protected gameInfo: any;
  protected gameCover!: string;
  userId: string = '';
  hasComment: boolean = false; // Indica si el usuario ya tiene un comentario

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private authService: AuthService,
    private apiService: ApiService,
    private firestore: Firestore,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.videogameSlug = params['slug'];
      if (this.videogameSlug) {
        this.apiService.getVideogameProfileFromSlug(this.videogameSlug).subscribe((response) => {
          this.gameInfo = response.apiResponse[0];
          this.videogameId = this.gameInfo.id.toString();

          this.apiService.getCoverURL(parseInt(this.videogameId), "cover_big").subscribe((response) => {
            this.gameCover = response.fullURL;
          });
          this.loadComments();
          this.checkIfUserHasComment();
        });
      }
    });
  }

  loadComments(): void {
    this.dataService.getCommentsByVideogameId(this.videogameId).subscribe(comments => {
      this.comments = comments;
      this.calculateAverage(comments)

      for (let comment of this.comments) {
        this.dataService.getUsersById(comment.userId).subscribe(user => {
          comment.user = user;
        });
      }
    });
  }

  calculateAverage(comments: any[]): void {
    if (!comments.length) {
      this.averageRating = 0;
      return;
    }
    const total = comments.reduce((sum, c) => sum + c.rating, 0);
    this.averageRating = Math.round(total / comments.length);
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
        console.log(user);
        this.router.navigate(['/login']);
      } else {
        // Si el usuario ha iniciado sesión, redirige a la página de newcoment
        this.router.navigate(['/new-comment', this.videogameSlug]);
      }
    });
  }
}
