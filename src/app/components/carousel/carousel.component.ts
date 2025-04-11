import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent implements OnInit {
  @Input() category!: string;
  data: any[] = [];
  
  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    if (this.category) {
      this.dataService.getVideogames(this.category).subscribe(response => {
        this.data = response.slice(0, 5);
      });
    }
  }
}
