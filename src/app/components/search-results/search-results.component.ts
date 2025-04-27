import {Component, inject, input} from '@angular/core';
import {NgForOf} from '@angular/common';
import {ApiService} from '../../services/api.service';

@Component({
  selector: 'app-search-results',
  imports: [
    NgForOf
  ],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css'
})
export class SearchResultsComponent {
  searchResults = input<any[]>([]);
  apiService = inject(ApiService);
}
