import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import { CommonModule } from '@angular/common';
import {Subscription} from 'rxjs';
import {marker as _} from '@colsen1991/ngx-translate-extract-marker';
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
export class FooterComponent implements OnInit, OnDestroy {
  private translate: TranslateService = inject(TranslateService);
  private storageService: StorageService = inject(StorageService);

  protected availableLanguages: string[] = ["Español (es)", "English (en)"];
  protected selectedLanguage: string = this.storageService.getItem('lang') || 'es';

  private translationSubscription: Subscription | undefined;

  showHelpModal = false;
  currentHelpStep = 0;
  helpSteps = [
    {
      image: '/assets/help/step1.png',
      text: '¡Bienvenido a Game-Critic! Aquí puedes descubrir y valorar videojuegos fácilmente.'
    },
    {
      image: '/assets/help/step2.png',
      text: 'Utiliza la barra de búsqueda para encontrar videojuegos o usuarios rápidamente.'
    },
    {
      image: '/assets/help/step3.png',
      text: 'Explora las categorías para descubrir juegos por género o novedades.'
    },
    {
      image: '/assets/help/step4.png',
      text: 'Haz clic en un juego para ver su perfil, leer reseñas y añadir tu propia valoración.'
    },
    {
      image: '/assets/help/step5.png',
      text: 'Sigue a otros usuarios y consulta sus valoraciones desde la sección "Siguiendo".'
    }
  ];

  ngOnInit(): void {
    this.translationSubscription = this.translate.stream(_([
      "footer.tutorial.step_1",
      "footer.tutorial.step_2",
      "footer.tutorial.step_3",
      "footer.tutorial.step_4",
      "footer.tutorial.step_5"
    ])).subscribe((translations: {[key: string]: string}) => {
      this.helpSteps = [
        {
          image: '/assets/help/step1.png',
          text: translations["footer.tutorial.step_1"]
        },
        {
          image: '/assets/help/step2.png',
          text: translations["footer.tutorial.step_2"]
        },
        {
          image: '/assets/help/step3.png',
          text: translations["footer.tutorial.step_3"]
        },
        {
          image: '/assets/help/step4.png',
          text: translations["footer.tutorial.step_4"]
        },
        {
          image: '/assets/help/step5.png',
          text: translations["footer.tutorial.step_5"]
        }
      ];
    });
  }

  ngOnDestroy() {
    if (this.translationSubscription) {
      this.translationSubscription.unsubscribe();
    }
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
}
