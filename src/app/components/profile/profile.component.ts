import {DataService} from '../../services/data.service';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Component, inject, Input, OnInit} from '@angular/core';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent  implements OnInit {

  @Input() type: string = '';
  data: any = null;
  gameInfo: any = null;
  gameCover: string = "";
  id!: string;
  apiService: ApiService = inject(ApiService);
  slug!: string;

  constructor(private dataService: DataService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
      this.slug = params['name'];
    });

    if(this.type === 'videogame'){
      if (this.slug !== undefined) {
        this.apiService.getVideogameProfileFromSlug(this.slug).subscribe((response) => {
          this.data = response;
          this.gameInfo = response.apiResponse[0];
          this.id = this.gameInfo.id;

          this.apiService.getCoverURL(parseInt(this.id), "cover_big").subscribe((response) => {
            this.gameCover = response.fullURL;
          });
        });
      }
      /**
      this.dataService.getVideogameById(this.id).subscribe(response => {
        this.data = response;
      });
       **/
    }else{
      this.dataService.getUsersById(this.id).subscribe(response => {
        this.data = response;
      });
    }
  }

  protected showReleaseYear() {
    return !isNaN(this.apiService.getReleaseYear(this.gameInfo.first_release_date));
  }
}
