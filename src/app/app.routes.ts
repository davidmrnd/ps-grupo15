import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { CategoriesPageComponent } from './pages/categories-page/categories-page.component';
import { VideogamePageComponent } from './pages/videogameprofile-page/videogameprofile-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'categories',
    component: CategoriesPageComponent,
  },
  {
    path: 'videogame',
    component: VideogamePageComponent,
  },
  {
    path: 'registration',
    component: RegisterPageComponent,
  }
];
