import {Component, inject} from '@angular/core';
import {TranslatePipe, TranslateService} from '@ngx-translate/core';
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-footer',
    imports: [
        TranslatePipe,
        FormsModule,
        NgForOf
    ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  protected availableLanguages: string[] = ["Español (es)", "English (en)"];
  protected selectedLanguage: string = "es";

  private translate: TranslateService = inject(TranslateService);

  changeLanguage() {
    this.translate.use(this.selectedLanguage);
  }

  getLanguageCode(language: string) {
    const languageCode = language.match(/\([a-z]{2}\)/g);
    if (languageCode) {
      return languageCode[0].substring(1, 3);
    }
    return "";
  }
}
