import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-videogameprofile-page',
  imports: [],
  templateUrl: './videogameprofile-page.component.html',
  styleUrl: './videogameprofile-page.component.css'
})
export class VideogameprofilePageComponent implements OnInit {
  videogame: any = null;

  constructor(private route: ActivatedRoute, private dataService: DataService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.dataService.getAllData().subscribe(data => {
        this.videogame = data.videogames.find((game: any) => game.id === parseInt(id, 10));
      });
    } else {
      console.error('ID parameter is missing');
    }
  }

}
