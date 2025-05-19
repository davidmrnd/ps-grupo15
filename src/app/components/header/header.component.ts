import {Component, OnInit, OnDestroy, inject, HostListener} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import {FormsModule} from '@angular/forms';
import {ApiService} from '../../services/api.service';
import {SearchResultsComponent} from '../search-results/search-results.component';
import {DataService} from '../../services/data.service';
import {TranslatePipe} from '@ngx-translate/core';
import {StorageService} from '../../services/storage.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterLink, FormsModule, SearchResultsComponent, TranslatePipe],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  userName: string | null = null;
  private userSubscription: Subscription | null = null;
  userId: any|string;
  searchType: 'user' | 'videogame' = 'videogame'; // Default to 'videogame'
  searchText: string = "";
  apiService: ApiService = inject(ApiService);
  searchResults: any[] = [];
  showSearchResults: boolean = false;
  isDarkModeEnabled: boolean = false;
  showUserDropdown: boolean = false;
  userProfileIcon: string = '/assets/images/usericondefault.png';

  private authService: AuthService = inject(AuthService);
  private dataService: DataService = inject(DataService);
  private storageService: StorageService = inject(StorageService);

  constructor() {}

  ngOnInit() {
    this.userSubscription = this.authService.getCurrentUserObservable().subscribe((user) => {
      this.isLoggedIn = !!user;
      this.userId = user?.uid || null;

      if (user && user.uid) {
        const localImage = this.storageService.getItem(`profile-image-${user.uid}`);
        if (localImage) {
          this.userProfileIcon = localImage;
        } else {
          this.dataService.getUsersById(user.uid).subscribe((userData: any) => {
            if (userData && userData.profileicon) {
              this.userProfileIcon = userData.profileicon;
            } else {
              this.userProfileIcon = '/assets/images/usericondefault.png';
            }
          });
        }
      } else {
        this.userProfileIcon = '/assets/images/usericondefault.png';
      }
    });

    const darkMode = this.storageService.getItem('dark-mode');
    if (darkMode === 'enabled') {
      document.body.classList.add('dark-mode');
      this.isDarkModeEnabled = true;
    } else {
      document.body.classList.remove('dark-mode');
      this.isDarkModeEnabled = false;
    }

    window.addEventListener("resize", (event) => {
      this.positionSearchResults();
    })
  }

  logout() {
    this.authService.logout().then(() => {
      this.isLoggedIn = false;
      this.userName = null;
      window.location.href = '/'; // Redirigir tras logout
    });
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
  }

  onSearchButtonClicked() {
    if (this.searchType === 'videogame') {
      this.apiService.search(10, this.searchText).subscribe((result) => {
        this.searchResults = result.apiResponse;
        this.showSearchResults = true;
      });
    } else if (this.searchType === 'user') {
      this.dataService.searchUser(this.searchText).subscribe((result) => {
        console.log("Resultado", result);
        this.searchResults = result;
        this.showSearchResults = true;
      });
    }
    this.positionSearchResults();
  }

  private positionSearchResults() {
    const searchResultsElement = document.getElementById('search-results');
    const searchContainerElement = document.querySelector(".search-container");

    if (searchResultsElement && searchContainerElement) {
      const boundingRect = searchContainerElement.getBoundingClientRect();
      searchResultsElement.style.width = `${boundingRect.width}px`;
      searchResultsElement.style.top = `${boundingRect.bottom + window.scrollY}px`;
      searchResultsElement.style.left = `${boundingRect.left}px`;
    }
  }

  onKeyDowmInSearchInput(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.onSearchButtonClicked();
    }
  }

  clearSearchText() {
    this.searchText = "";
    this.showSearchResults = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const searchResultsElement = document.getElementById('search-results');
    const searchContainerElement = document.querySelector(".search-container");
    const userDropdown = document.querySelector('.user-dropdown-container');

    if (
      searchResultsElement &&
      searchContainerElement &&
      !searchResultsElement.contains(event.target as Node) &&
      !searchContainerElement.contains(event.target as Node)
    ) {
      this.showSearchResults = false;
    }

    // Cerrar el dropdown si se hace click fuera
    if (
      userDropdown &&
      !userDropdown.contains(event.target as Node)
    ) {
      this.showUserDropdown = false;
    }
  }

  toggleDarkMode(): void {
    this.isDarkModeEnabled = !this.isDarkModeEnabled;
    if (this.isDarkModeEnabled) {
      document.body.classList.add('dark-mode');
      this.storageService.setItem('dark-mode', 'enabled');
    } else {
      document.body.classList.remove('dark-mode');
      this.storageService.setItem('dark-mode', 'disabled');
    }
  }

  // Dropdown para usuario
  toggleUserDropdown() {
    this.showUserDropdown = !this.showUserDropdown;
  }

  closeUserDropdown() {
    this.showUserDropdown = false;
  }
}
