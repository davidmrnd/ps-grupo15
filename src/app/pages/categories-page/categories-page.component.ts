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
  showDropdown: boolean = false;
  allCategories: string[] = ['Acción', 'Supervivencia', 'Disparos', 'Deportes', 'Aventura', 'Terror'];
  defaultCategories: string[] = ['Acción', 'Supervivencia', 'Disparos', 'Deportes'];
  selectedCategories: string[] = [];
  isUsingDefault: boolean = true;

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  onCategoryChange(event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const category = checkbox.value;

    if (checkbox.checked) {
      if (!this.selectedCategories.includes(category)) {
        this.selectedCategories.push(category);
      }
      this.isUsingDefault = false;
    } else {
      this.selectedCategories = this.selectedCategories.filter(c => c !== category);
      if (this.selectedCategories.length === 0) {
        this.isUsingDefault = true;
      }
    }
  }

  getDisplayedCategories(): string[] {
    return this.isUsingDefault ? this.defaultCategories : this.selectedCategories;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const dropdown = document.querySelector('.categories-dropdown-container');

    if (dropdown && !dropdown.contains(target)) {
      this.showDropdown = false;
    }
  }
}
