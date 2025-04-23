import { Component, Input, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent implements OnInit {
  @Input() category!: string;
  data: any[] = [];
  @ViewChild('carouselTrack') carouselTrack!: ElementRef;
  visibleSlides: number = 4;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    if (this.category) {
      this.dataService.getVideogames(this.category).subscribe(response => {
        this.data = response.slice(0, 5); // ajustar el número de elementos a mostrar
      });
    }
    this.updateVisibleSlides();
  }

  @HostListener('window:resize')
  updateVisibleSlides(): void {
    const width = window.innerWidth;
    if (width <= 767) {
      this.visibleSlides = 2;
    } else if (width <= 1024) {
      this.visibleSlides = 3;
    } else {
      this.visibleSlides = 4;
    }
  }

  moveCarousel(direction: 'prev' | 'next'): void {
    const track = this.carouselTrack.nativeElement;
    const slideWidth = track.firstElementChild.offsetWidth + 28;
    const currentTransform = parseFloat(getComputedStyle(track).transform.split(',')[4]) || 0;

    if (direction === 'prev') {
      if (currentTransform === 0) {
        const maxTransform = -(slideWidth * (this.data.length - this.visibleSlides));
        track.style.transform = `translateX(${maxTransform}px)`;
      } else {
        track.style.transform = `translateX(${Math.min(currentTransform + slideWidth, 0)}px)`;
      }
    } else if (direction === 'next') {
      const maxTransform = -(slideWidth * (this.data.length - this.visibleSlides));
      if (currentTransform === maxTransform) {
        track.style.transform = `translateX(0px)`;
      } else {
        track.style.transform = `translateX(${Math.max(currentTransform - slideWidth, maxTransform)}px)`;
      }
    }
  }
}
