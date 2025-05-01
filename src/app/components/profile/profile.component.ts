import {DataService} from '../../services/data.service';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Component, inject, input, Input, OnInit} from '@angular/core';
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
  @Input() gameInfo: any = null;
  @Input() gameCover: string = "";
  id!: string;
  apiService: ApiService = inject(ApiService);

  constructor(private dataService: DataService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
    });

    if(this.type === 'videogame'){
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
