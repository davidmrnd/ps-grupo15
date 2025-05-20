import { Component, OnInit, OnDestroy } from '@angular/core';
import { CarouselComponent } from '../../components/carousel/carousel.component';
import { CommonModule } from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-categories-page',
  imports: [
    CarouselComponent, CommonModule, TranslatePipe
  ],
  templateUrl: './categories-page.component.html',
  styleUrl: './categories-page.component.css'
})
export class CategoriesPageComponent implements OnInit, OnDestroy {
  defaultCategories: string[] =  [
    "categories.action",
    "categories.survival",
    "categories.shooter",
    "categories.sports",
    "categories.adventure",
    "categories.horror"];
  selectedCategories: string[] = [];
  isUsingDefault: boolean = true;
  private categoriesSub: any;

  constructor(private dataService: DataService) {}

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
