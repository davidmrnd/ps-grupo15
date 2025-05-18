import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FooterComponent} from './components/footer/footer.component';
import {HeaderComponent} from './components/header/header.component';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'game-critic-angular';

  constructor(private translate: TranslateService) {
    this.translate.addLangs(["es", "en"]);
    this.translate.setDefaultLang('es');
    const browserLang = localStorage.getItem('lang') || 'es';
    this.translate.use(browserLang);
  }
}
