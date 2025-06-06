import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { CategoriesPageComponent } from './pages/categories-page/categories-page.component';
import { VideogamePageComponent } from './pages/videogameprofile-page/videogameprofile-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { UserPageComponent } from './pages/userprofile-page/userprofile-page.component';
import { NewcomentPageComponent } from './pages/newcoment-page/newcoment-page.component';
import { FollowingPageComponent } from './pages/following-page/following-page.component';
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
    path: 'videogame/:slug',
    component: VideogamePageComponent,
  },
  {
    path: 'registration',
    component: RegisterPageComponent,
  },
  {
    path: 'user/:id',
    component: UserPageComponent,
  },
  {
    path: 'new-comment/:slug',
    component: NewcomentPageComponent,
  },
  {
    path: 'following',
    component: FollowingPageComponent,
  }
];
