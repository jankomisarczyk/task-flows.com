import { computed, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ENVIRONMENT } from '@angular/docs';
import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { authState } from 'rxfire/auth';
import { defer, from } from 'rxjs';

export type AuthUser = User | null;

interface AuthState {
  user: AuthUser;
}

export interface Credentials {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private environment: any = inject(ENVIRONMENT);
  private app = initializeApp(this.environment.firebase);
  private auth = getAuth(this.app);
  private analytics = getAnalytics(this.app);
  private user$ = authState(this.auth);
  private state = signal<AuthState>({
    user: null,
  });
  user = computed(() => this.state().user);

  constructor() {
    this.user$.pipe(takeUntilDestroyed()).subscribe((user) => {
      console.log('User state changed', user?.getIdToken());
      return this.state.update((state) => ({
        ...state,
        user,
      }));
    });
  }

  login(credentials: Credentials) {
    return from(
      defer(() =>
        signInWithEmailAndPassword(
          this.auth,
          credentials.email,
          credentials.password
        )
      )
    );
  }

  logout() {
    signOut(this.auth);
  }

  createAccount(credentials: Credentials) {
    return from(
      defer(() =>
        createUserWithEmailAndPassword(
          this.auth,
          credentials.email,
          credentials.password
        )
      )
    );
  }

  getToken() {
    return from(defer(() => this.user()?.getIdToken() ?? ''));
  }
}
