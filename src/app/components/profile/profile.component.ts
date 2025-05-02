import { DataService } from '../../services/data.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

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
  id!: string;

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
}
