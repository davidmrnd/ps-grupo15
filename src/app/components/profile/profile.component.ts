import {DataService} from '../../services/data.service';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {Component, Input, OnInit} from '@angular/core';

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
  id!: string;

  constructor(private dataService: DataService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.id = params['id'];
    });
    console.log(this.id);

    if(this.type === 'videogame'){
      this.dataService.getVideogameById(this.id).subscribe(response => {
        this.data = response;
      });
    }else{
      this.dataService.getUsersById(this.id).subscribe(response => {
        this.data = response;
      });
    }
  }
}
