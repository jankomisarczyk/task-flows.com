import { Routes } from '@angular/router';
import { isAuthenticatedGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home.component'),
        data: { label: 'Home' },
      },
      {
        path: 'auth',
        loadChildren: () =>
          import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
      },
      {
        path: 'chat',
        canActivate: [isAuthenticatedGuard()],
        loadComponent: () => import('./features/chat/chat.component'),
        data: { label: 'Chat' },
      },
    ],
  },
];
