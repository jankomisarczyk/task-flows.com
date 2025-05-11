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
      {
        path: 'blog',
        loadComponent: () =>
          import('./pages/components/blog/blog.component').then(
            (m) => m.BlogComponent
          ),
      },
      {
        path: 'philosophy',
        loadComponent: () =>
          import('./pages/components/philosophy/philosophy.component').then(
            (m) => m.PhilosophyComponent
          ),
      },
      {
        path: 'ctrlf',
        loadComponent: () =>
          import('./pages/components/ctrlf/ctrlfpost.component').then(
            (m) => m.CtrlfPostComponent
          ),
      },
      {
        path: 'ctrlf/app',
        loadComponent: () =>
          import('./pages/components/ctrlf/ctrlf.component').then(
            (m) => m.CtrlfComponent
          ),
      },
      {
        path: 'piano',
        loadComponent: () =>
          import('./pages/components/piano/piano.component').then(
            (m) => m.PianoComponent
          ),
      },
      {
        path: 'calisthenics',
        loadComponent: () =>
          import('./pages/components/calisthenics/calisthenics.component').then(
            (m) => m.CalisthenicsComponent
          ),
      },
      {
        path: 'books',
        loadComponent: () =>
          import('./pages/components/books/books.component').then(
            (m) => m.BooksComponent
          ),
      },
    ],
  },
];
