import {Component, inject, OnInit} from '@angular/core';
import { ProfileComponent } from '../../components/profile/profile.component';
import { NewcomentComponent } from "../../components/newcoment/newcoment.component";
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {NgIf} from '@angular/common';
import {AuthService} from '../../services/auth.service';
import {TranslatePipe} from '@ngx-translate/core';
import {StorageService} from '../../services/storage.service';

@Component({
  selector: 'app-newcoment-page',
  imports: [
    ProfileComponent,
    NewcomentComponent,
    NgIf,
    TranslatePipe
  ],
  templateUrl: './newcoment-page.component.html',
  styleUrl: './newcoment-page.component.css'
})
export class NewcomentPageComponent implements OnInit {
  private videogameSlug!: string | null;
  protected gameInfo: any;
  protected videogameId: string = "";
  protected gameCover!: string;
  showContent: boolean = false;
  showErrorMessage: boolean = false;
  showErrorMessageType: string = "";

  private authService: AuthService = inject(AuthService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private apiService: ApiService = inject(ApiService);
  private storageService: StorageService = inject(StorageService);

  protected selectedLanguage: string = this.storageService.getItem("lang") || 'es';

  constructor() {
  }

  ngOnInit(): void {
    this.storageService.language$.subscribe(value => {
      if (this.gameInfo && value != 'en') {

        if (this.gameInfo.summary) {
          if (!this.gameInfo.translatedSummary) {
            this.gameInfo.translatedSummary = {};
          }

          if (!this.gameInfo.translatedSummary[value]) {
            this.apiService.translateText(
              this.gameInfo.summary,
              value
            ).subscribe((response) => {
              this.gameInfo.translatedSummary[value] = response.translatedText;
            });
          }
        }
      }
      this.selectedLanguage = value;
    });

    this.route.params.subscribe(params => {
      this.videogameSlug = params["slug"];
      if (this.videogameSlug) {
        this.apiService.getVideogameProfileFromSlug(this.videogameSlug).subscribe((response) => {
          this.gameInfo = response.apiResponse[0];

          if (this.gameInfo) {
            this.videogameId = this.gameInfo.id.toString();

            if (this.gameInfo.summary) {
              if (this.selectedLanguage != 'en') {
                this.apiService.translateText(this.gameInfo.summary, this.selectedLanguage).subscribe((response) => {
                  this.gameInfo.translatedSummary = {};
                  this.gameInfo.translatedSummary[this.selectedLanguage] = response.translatedText;
                });
              }
            }

            this.apiService.getCoverURL(parseInt(this.videogameId), "cover_big").subscribe((response) => {
              this.gameCover = response.fullURL;
            });
          }

          else {
            this.showErrorMessage = true;
            this.showErrorMessageType = "invalid-game";
          }

          this.authService.getCurrentUserObservable().subscribe((user) => {
            console.log(user);
            if (!user) {
              this.showErrorMessage = true;
              this.showErrorMessageType = "no-logged-in";
            }
          });

          this.showContent = true;
        });
      }
    });
  }

  navigateToExplore() {
    this.router.navigate(['/categories']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToRegister() {
    this.router.navigate(['/registration']);
  }
}
