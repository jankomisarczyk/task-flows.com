import { Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/components/about_me/aboutme.component').then(
            (m) => m.AboutMeComponent
          ),
      },
    ],
  },
];
