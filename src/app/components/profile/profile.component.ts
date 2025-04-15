import {Component, Input, OnInit} from '@angular/core';
import {DataService} from '../../services/data.service';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';

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
  id!: number;

  constructor(private dataService: DataService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    if(this.type === 'videogame'){
      this.route.queryParams.subscribe(params => {
        this.id = Number(params['id']);
      });
      this.dataService.getVideogameById(this.id).subscribe(response => {
        this.data = response;
      });
    }
  }
}
