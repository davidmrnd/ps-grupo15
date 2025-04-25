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

  onStarClick(star: number): void {
    this.rating = star;
    this.ratingChange.emit(this.rating);
  }
}