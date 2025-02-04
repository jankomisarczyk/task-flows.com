import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FirebaseService } from '../services/firebase/firebase.service';

export const isAuthenticatedGuard = (): CanActivateFn => {
  return () => {
    const firebaseService = inject(FirebaseService);
    const router = inject(Router);

    if (firebaseService.user()) {
      return true;
    }

    return router.parseUrl('auth/login');
  };
};
