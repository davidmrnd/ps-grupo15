import {Component, inject, Input} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {ApiService} from '../../services/api.service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-search-results',
  imports: [
    NgForOf,
    NgIf,
    RouterLink
  ],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css'
})
export class SearchResultsComponent {
  @Input() searchResults: any[] = [];
  apiService = inject(ApiService);

  showYear(releaseDate: number) {
    return !isNaN(releaseDate)
  }

  clearResults() {
    this.searchResults = []
  }
}
