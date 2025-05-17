import {Component, inject, OnInit} from '@angular/core';
import { ProfileComponent } from '../../components/profile/profile.component';
import { NewcomentComponent } from "../../components/newcoment/newcoment.component";
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {NgIf} from '@angular/common';
import {AuthService} from '../../services/auth.service';
import {TranslatePipe} from '@ngx-translate/core';

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

  constructor() {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.videogameSlug = params["slug"];
      if (this.videogameSlug) {
        this.apiService.getVideogameProfileFromSlug(this.videogameSlug).subscribe((response) => {
          this.gameInfo = response.apiResponse[0];

          if (this.gameInfo) {
            this.videogameId = this.gameInfo.id.toString();

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
