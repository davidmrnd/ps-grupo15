import {Component, OnInit, OnDestroy, inject} from '@angular/core';
import { CarouselComponent } from '../../components/carousel/carousel.component';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-categories-page',
  imports: [
    CarouselComponent, CommonModule
  ],
  templateUrl: './categories-page.component.html',
  styleUrl: './categories-page.component.css'
})
export class CategoriesPageComponent implements OnInit, OnDestroy {
  defaultCategories: string[] =  [
    "carousel.categories.action",
    "carousel.categories.survival",
    "carousel.categories.shooter",
    "carousel.categories.sports",
    "carousel.categories.adventure",
    "carousel.categories.horror"
  ];
  selectedCategories: string[] = [];
  isUsingDefault: boolean = true;
  private categoriesSub: any;

  private dataService: DataService = inject(DataService);

  constructor() {}

  ngOnInit() {
    this.categoriesSub = this.dataService.selectedCategories$.subscribe(categories => {
      this.selectedCategories = categories;
      this.isUsingDefault = this.selectedCategories.length === 0;
    });
  }

  ngOnDestroy() {
    this.categoriesSub?.unsubscribe();
  }

  getDisplayedCategories(): string[] {
    return this.isUsingDefault ? this.defaultCategories : this.selectedCategories;
  }

}
