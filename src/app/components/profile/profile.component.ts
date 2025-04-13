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
    console.log(this.type);
    if(this.type === 'videogame'){
      this.id = Number(this.route.snapshot.paramMap.get('id'));
      console.log(this.id);
      this.dataService.getVideogameById(this.id).subscribe(response => {
        this.data = response;
        console.log(this.data);
      });
    }
  }
}
