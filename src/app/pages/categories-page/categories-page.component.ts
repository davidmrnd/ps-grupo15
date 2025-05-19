import { Component, HostListener } from '@angular/core';
import { CarouselComponent } from '../../components/carousel/carousel.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories-page',
  imports: [
    CarouselComponent, CommonModule
  ],
  templateUrl: './categories-page.component.html',
  styleUrl: './categories-page.component.css'
})
export class CategoriesPageComponent {

  allCategories: string[] = ['Acción', 'Supervivencia', 'Disparos', 'Deportes', 'Aventura', 'Terror'];
  defaultCategories: string[] = ['Acción', 'Supervivencia', 'Disparos', 'Deportes'];
  selectedCategories: string[] = [];
  isUsingDefault: boolean = true;

  getDisplayedCategories(): string[] {
    return this.isUsingDefault ? this.defaultCategories : this.selectedCategories;
  }
}
