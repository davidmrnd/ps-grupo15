import { DataService } from '../../services/data.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {Component, inject, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit, OnChanges {
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
      this.tryLoadData();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['type']) {
      this.tryLoadData();
    }
  }

  private tryLoadData(): void {
    if (this.id && this.type) {
      this.loadData();
    }
  }

  private loadData(): void {
    if (this.type === 'videogame') {
      this.dataService.getVideogameById(this.id).subscribe(response => {
        this.data = response;
      });
    } else {
      this.dataService.getUsersById(this.id).subscribe(response => {
        this.data = response;
      });
    }
  }

  protected showReleaseYear() {
    return !isNaN(this.apiService.getReleaseYear(this.gameInfo.first_release_date));
  }
}
