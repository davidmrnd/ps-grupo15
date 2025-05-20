import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ElementRef,
  HostListener,
  inject,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {ApiService} from '../../services/api.service';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent implements OnInit, OnChanges {
  @Input() category!: string;
  videogameData: any[] = [];
  coverData: any[] = [];
  @ViewChild('carouselTrack') carouselTrack!: ElementRef;
  visibleSlides: number = 4;
  carouselGames = new Map<string, number[]>();
  private apiService: ApiService = inject(ApiService);

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["category"]) {
      this.loadCarousels();
    }
  }

  ngOnInit(): void {
    this.carouselGames.set("carousel.categories.new", [112875, 1020, 126290, 267306, 300976, 305152, 136879, 332780]);
    this.carouselGames.set("carousel.categories.action", [103054, 127044, 112875, 1020, 378, 76844]);
    this.carouselGames.set("carousel.categories.survival", [10239, 135400, 1879, 7504, 126290]);
    this.carouselGames.set("carousel.categories.shooter", [242408, 9509, 83728, 114795, 109096]);
    this.carouselGames.set("carousel.categories.sports", [308034, 19554, 138766, 308698, 24985]);
    this.carouselGames.set("carousel.categories.adventure", [7346, 26192, 565, 25076, 7599, 1164]);
    this.carouselGames.set("carousel.categories.horror", [19686, 222341, 14390, 111, 284721]);
    this.loadCarousels();
  }

  private loadCarousels() {
    if (this.category) {
      const idList = this.carouselGames.get(this.category);
      if (idList) {
        this.apiService.getVideogameInfoForCorouselAndUserProfile(idList).subscribe((response) => {
          this.videogameData = response.apiResponse[0].result;
          this.coverData = response.apiResponse[1].result;
          for (const videogame of this.videogameData) {
            const videogameCoverData = this.coverData.find((cover) => cover.game === videogame.id);
            videogame.coverURL = `https://images.igdb.com/igdb/image/upload/t_1080p/${videogameCoverData.image_id}.jpg`
          }
        });
      }
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
      this.visibleSlides = 5;
    }
  }

  moveCarousel(direction: 'prev' | 'next'): void {
    const track = this.carouselTrack.nativeElement;
    const slideWidth = track.firstElementChild.offsetWidth + 28;
    const currentTransform = parseFloat(getComputedStyle(track).transform.split(',')[4]) || 0;

    if (direction === 'prev') {
      if (currentTransform === 0) {
        const maxTransform = -(slideWidth * (this.videogameData.length - this.visibleSlides));
        track.style.transform = `translateX(${maxTransform}px)`;
      } else {
        track.style.transform = `translateX(${Math.min(currentTransform + slideWidth, 0)}px)`;
      }
    } else if (direction === 'next') {
      const maxTransform = -(slideWidth * (this.videogameData.length - this.visibleSlides));
      if (currentTransform === maxTransform) {
        track.style.transform = `translateX(0px)`;
      } else {
        track.style.transform = `translateX(${Math.max(currentTransform - slideWidth, maxTransform)}px)`;
      }
    }
  }
}
