import {Component, Input, OnInit} from '@angular/core';
import { ProfileComponent } from '../../components/profile/profile.component';
import { NewcomentComponent } from "../../components/newcoment/newcoment.component";
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'app-newcoment-page',
  imports: [
    ProfileComponent,
    NewcomentComponent
],
  templateUrl: './newcoment-page.component.html',
  styleUrl: './newcoment-page.component.css'
})
export class NewcomentPageComponent implements OnInit {
  private videogameSlug!: string | null;
  protected gameInfo: any;
  protected videogameId: string = "";
  protected gameCover!: string;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.videogameSlug = params["slug"];
      if (this.videogameSlug) {
        this.apiService.getVideogameProfileFromSlug(this.videogameSlug).subscribe((response) => {
          this.gameInfo = response.apiResponse[0];
          this.videogameId = this.gameInfo.id.toString();

          this.apiService.getCoverURL(parseInt(this.videogameId), "cover_big").subscribe((response) => {
            this.gameCover = response.fullURL;
          });
        });
      }
    });
  }
}
