import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {ApiService} from '../../services/api.service';
import {RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-search-results',
  imports: [
    NgForOf,
    NgIf,
    RouterLink,
    TranslatePipe
  ],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css'
})
export class SearchResultsComponent {
  @Input() searchResults: any[] = [];
  @Output() searchResultClicked = new EventEmitter();
  apiService = inject(ApiService);
  @Input() showSearchResults!: boolean;
  @Input() searchType: 'user' | 'videogame' = 'videogame';

  showYear(releaseDate: number) {
    return !isNaN(releaseDate)
  }

  clearResults() {
    this.searchResults = [];
    this.searchResultClicked.emit();
  }
}
