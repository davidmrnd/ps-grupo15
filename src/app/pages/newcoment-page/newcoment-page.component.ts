import {Component, OnInit} from '@angular/core';
import { ProfileComponent } from '../../components/profile/profile.component';
import { NewcomentComponent } from "../../components/newcoment/newcoment.component";
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-newcoment-page',
  imports: [
    ProfileComponent,
    NewcomentComponent,
    NgIf
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

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
  ) {
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
          }

          this.showContent = true;
        });
      }
    });
  }

  navigateToExplore() {
    this.router.navigate(['/categories']);
  }
}
