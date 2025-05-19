import {Component, inject} from '@angular/core';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";
import { CommonModule } from '@angular/common';

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
export class FooterComponent {
  protected availableLanguages: string[] = ["Español (es)", "English (en)"];
  protected selectedLanguage: string = localStorage.getItem('lang') || 'es';

  private translate: TranslateService = inject(TranslateService);

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
    localStorage.setItem('lang', this.selectedLanguage);
  }

  getLanguageCode(language: string) {
    const languageCode = language.match(/\([a-z]{2}\)/g);
    if (languageCode) {
      return languageCode[0].substring(1, 3);
    }
    return "";
  }
}
