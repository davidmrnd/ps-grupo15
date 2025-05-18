import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { ProfileComponent } from '../../components/profile/profile.component';
import { StarsComponent } from '../../components/stars/stars.component';
import { CommentariesComponent } from '../../components/commentaries/commentaries.component';
import { AuthService } from '../../services/auth.service';
import {ApiService} from '../../services/api.service';
import {collection, Firestore, getDocs, query, where} from '@angular/fire/firestore';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {marker as _} from '@colsen1991/ngx-translate-extract-marker';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-videogameprofile-page',
  templateUrl: './videogameprofile-page.component.html',
  styleUrls: ['./videogameprofile-page.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ProfileComponent,
    StarsComponent,
    CommentariesComponent,
    TranslatePipe
  ]
})
export class VideogamePageComponent implements OnInit, OnDestroy {
  comments: any[] = [];
  averageRating: number = 0;
  videogameId!: string;
  private videogameSlug!: string | null;
  protected gameInfo: any;
  protected gameCover!: string;
  userId: string = '';
  hasComment: boolean = false; // Indica si el usuario ya tiene un comentario
  showContent: boolean = false;
  showErrorMessage: boolean = false;

  private dataService: DataService = inject(DataService);
  private authService: AuthService = inject(AuthService);
  private firestore: Firestore = inject(Firestore);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private apiService: ApiService = inject(ApiService);
  private router: Router = inject(Router);
  private translate: TranslateService = inject(TranslateService);

  private translationSubscription: Subscription | undefined;
  protected modifyReviewText: string = 'Modificar valoración';
  protected addReviewText: string = 'Añadir valoración';

  constructor() {}

  ngOnInit(): void {
    this.translationSubscription = this.translate.stream(_([
      "videogame_profile_page.modify_review",
      "videogame_profile_page.add_review",
    ])).subscribe((translations: {[key: string]: string}) => {
      this.modifyReviewText = translations["videogame_profile_page.modify_review"];
      this.addReviewText = translations["videogame_profile_page.add_review"];
    });

    this.route.params.subscribe(params => {
      this.videogameSlug = params['slug'];
      if (this.videogameSlug) {
        this.apiService.getVideogameProfileFromSlug(this.videogameSlug).subscribe((response) => {
          this.gameInfo = response.apiResponse[0];

          if (this.gameInfo) {
            this.videogameId = this.gameInfo.id.toString();

            this.apiService.getCoverURL(parseInt(this.videogameId), "cover_big").subscribe((response) => {
              this.gameCover = response.fullURL;
            });

            if (this.gameInfo.platforms && this.gameInfo.genres) {
              this.apiService.getGenreAndPlatformNames(this.gameInfo.genres, this.gameInfo.platforms).subscribe((response) => {
                this.gameInfo.platformsNames = response.apiResponse[0].result;
                this.gameInfo.genresNames = response.apiResponse[1].result;
              });
            }

            else {
              this.apiService.getPlatformNames(this.gameInfo.platforms).subscribe((response) => {
                this.gameInfo.platformsNames = response.apiResponse;
              });

              this.apiService.getGenreNames(this.gameInfo.genres).subscribe((response) => {
                this.gameInfo.genresNames = response.apiResponse;
              });
            }
          }

          else {
            this.showErrorMessage = true;
          }

          this.showContent = true;
          this.loadComments();
          this.checkIfUserHasComment();
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.translationSubscription) {
      this.translationSubscription.unsubscribe();
    }
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

  navigateToExplore() {
    this.router.navigate(['/categories']);
  }
}
