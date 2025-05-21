import { Component, OnInit, OnDestroy, inject, HostListener } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { SearchResultsComponent } from '../search-results/search-results.component';
import { DataService } from '../../services/data.service';
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
  userId: any | string;
  searchType: 'user' | 'videogame' = 'videogame';
  searchText: string = "";
  apiService: ApiService = inject(ApiService);
  searchResults: any[] = [];
  showSearchResults: boolean = false;
  isDarkModeEnabled: boolean = false;
  showUserDropdown: boolean = false;
  userProfileIcon: string = '/assets/images/usericondefault.png';
  showDropdown: boolean = false;
  allCategories: string[] = [
    "carousel.categories.action",
    "carousel.categories.survival",
    "carousel.categories.shooter",
    "carousel.categories.sports",
    "carousel.categories.adventure",
    "carousel.categories.horror"
  ];
  selectedCategories: string[] = [];
  isUsingDefault: boolean = true;
  isCategoriesPage: boolean = false;
  mobileMenuOpen = false;

  private authService: AuthService = inject(AuthService);
  private dataService: DataService = inject(DataService);
  private router: Router = inject(Router);
  private storageService: StorageService = inject(StorageService);

  constructor() {}

  ngOnInit() {
    window.addEventListener('storage', this.onStorageChange.bind(this));

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

    window.addEventListener("resize", () => {
      this.positionSearchResults();
    });

    this.router.events.subscribe(() => {
      this.isCategoriesPage = this.router.url.startsWith('/categories');
      if (this.isCategoriesPage) {
        this.selectedCategories = [];
        this.dataService.setSelectedCategories(this.selectedCategories);
      }
      this.mobileMenuOpen = false;
    });

    this.isCategoriesPage = this.router.url.startsWith('/categories');
    if (this.isCategoriesPage) {
      this.selectedCategories = [];
      this.dataService.setSelectedCategories(this.selectedCategories);
    }
  }

  logout() {
    this.authService.logout().then(() => {
      this.isLoggedIn = false;
      this.userName = null;
      window.location.href = '/';
    });
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
  }

  onSearchButtonClicked() {
    if (this.searchType === 'videogame') {
      this.apiService.search(10, this.searchText).subscribe((result) => {
        this.searchResults = result.apiResponse; // o prueba con result directamente
        this.showSearchResults = true;
      });
    } else if (this.searchType === 'user') {
      this.dataService.searchUser(this.searchText).subscribe((result) => {
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
  onDocumentClick(event: MouseEvent) {
    const searchResultsElement = document.getElementById('search-results');
    const searchContainerElement = document.querySelector(".search-container");
    const userDropdown = document.querySelector('.user-dropdown-container');
    const dropdown = document.querySelector('.categories-dropdown-container');
    const menuButton = document.querySelector('.menu-button');
    const navLinks = document.querySelector('.nav-links');
    const target = event.target as HTMLElement;

    if (
      searchResultsElement &&
      searchContainerElement &&
      !searchResultsElement.contains(target) &&
      !searchContainerElement.contains(target)
    ) {
      this.showSearchResults = false;
    }

    if (
      userDropdown &&
      !userDropdown.contains(target)
    ) {
      this.showUserDropdown = false;
    }

    if (dropdown && !dropdown.contains(target)) {
      this.showDropdown = false;
    }

    if (
      this.mobileMenuOpen &&
      navLinks &&
      menuButton &&
      !navLinks.contains(target) &&
      !menuButton.contains(target)
    ) {
      this.mobileMenuOpen = false;
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

  toggleUserDropdown() {
    this.showUserDropdown = !this.showUserDropdown;
  }

  closeUserDropdown() {
    this.showUserDropdown = false;
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
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
    localStorage.setItem('selectedCategories', JSON.stringify(this.selectedCategories));
    this.dataService.setSelectedCategories(this.selectedCategories);
  }

  onStorageChange(event: StorageEvent): void {
    if (event.key === 'dark-mode') {
      this.toggleDarkMode();
    }
  }
}

