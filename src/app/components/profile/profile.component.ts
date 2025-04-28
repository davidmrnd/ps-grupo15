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
  gameCover: any = null;
  id!: string;
  apiService: ApiService = inject(ApiService);

  constructor(private dataService: DataService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
    });

    if(this.type === 'videogame'){
      this.apiService.getVideogameProfile(parseInt(this.id)).subscribe((response) => {
        this.data = response;
        this.gameInfo = response.apiResponse[0].result[0];
        this.gameCover = response.apiResponse[1].result[0];
      })
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

  protected getVideogameCoverURL() : string{
    return `https://images.igdb.com/igdb/image/upload/t_cover_big/${this.gameCover.image_id}.jpg`
  }

  protected showReleaseYear() {
    return !isNaN(this.apiService.getReleaseYear(this.gameInfo.first_release_date));
  }
}
