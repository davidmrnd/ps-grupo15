import {Component, inject, input} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'app-search-results',
  imports: [
    NgForOf,
    NgIf
  ],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css'
})
export class SearchResultsComponent {
  searchResults = input<any[]>([]);
  apiService = inject(ApiService);

  showYear(releaseDate: number) {
    return !isNaN(releaseDate)
  }
}
