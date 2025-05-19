import {Component, inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FooterComponent} from './components/footer/footer.component';
import {HeaderComponent} from './components/header/header.component';
import {TranslateService} from '@ngx-translate/core';
import {StorageService} from './services/storage.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'game-critic-angular';
  private translate: TranslateService = inject(TranslateService);
  private storageService: StorageService = inject(StorageService);

  constructor() {
    this.translate.addLangs(["es", "en"]);
    this.translate.setDefaultLang('es');
    const browserLang = this.storageService.getItem('lang') || 'es';
    this.translate.use(browserLang);
  }
}
