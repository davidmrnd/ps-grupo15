import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stars',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.css']
})
export class StarsComponent {
  @Input() rating: number = 0; 
  @Output() ratingChange = new EventEmitter<number>();
  @Input() interactive: boolean = false; // Controla si las estrellas son interactivas

  onStarClick(star: number): void {
    if (this.interactive) {
      this.rating = star;
      this.ratingChange.emit(this.rating);
    }
  }
}