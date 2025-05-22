import {Component, inject, OnInit} from '@angular/core';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import { CommonModule } from '@angular/common';
import {StorageService} from '../../services/storage.service';

@Component({
  selector: 'app-footer',
    imports: [
        TranslatePipe,
        FormsModule,
        NgForOf,
        CommonModule
    ],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  private translate: TranslateService = inject(TranslateService);
  private storageService: StorageService = inject(StorageService);

  protected availableLanguages: string[] = ["Español (es)", "English (en)"];
  protected selectedLanguage: string = this.storageService.getItem('lang') || 'es';

  showHelpModal = false;
  currentHelpStep = 0;
  helpSteps = [
    {
      image: '/assets/help/step1.png',
      text: 'footer.tutorial.step_1'
    },
    {
      image: '/assets/help/step2.png',
      text: 'footer.tutorial.step_2'
    },
    {
      image: '/assets/help/step3.png',
      text: 'footer.tutorial.step_3'
    },
    {
      image: '/assets/help/step4.png',
      text: 'footer.tutorial.step_4'
    },
    {
      image: '/assets/help/step5.png',
      text: 'footer.tutorial.step_5'
    }
  ];

  ngOnInit(): void {
    window.addEventListener("storage", this.onStorageChange.bind(this));
  }

  openHelpModal() {
    this.showHelpModal = true;
    this.currentHelpStep = 0;
  }

  closeHelpModal() {
    this.showHelpModal = false;
    this.currentHelpStep = 0;
  }

  nextHelpStep() {
    if (this.currentHelpStep < this.helpSteps.length - 1) {
      this.currentHelpStep++;
    }
  }

  prevHelpStep() {
    if (this.currentHelpStep > 0) {
      this.currentHelpStep--;
    }
  }

  changeLanguage() {
    this.translate.use(this.selectedLanguage);
    this.storageService.setItem('lang', this.selectedLanguage);
  }

  getLanguageCode(language: string) {
    const languageCode = language.match(/\([a-z]{2}\)/g);
    if (languageCode) {
      return languageCode[0].substring(1, 3);
    }
    return "";
  }

  onStorageChange(event: StorageEvent) {
    if (event.key === "lang") {
      this.translate.use(event.newValue || 'es');
      this.selectedLanguage = event.newValue || 'es';
      this.storageService.setItem('lang', event.newValue || 'es');
    }
  }
}
