import { Injectable, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, Subject, switchMap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FirebaseService } from '../../../../core/services/firebase/firebase.service';
import { Credentials } from '../../../../core/services/firebase/firebase.service';

export type LoginStatus = 'pending' | 'authenticating' | 'success' | 'error';

interface LoginState {
  status: LoginStatus;
}

@Injectable()
export class LoginService {
  private authService = inject(FirebaseService);

  // sources
  error$ = new Subject<any>();
  login$ = new Subject<Credentials>();

  userAuthenticated$ = this.login$.pipe(
    switchMap((credentials) =>
      this.authService.login(credentials).pipe(
        catchError((err) => {
          this.error$.next(err);
          return EMPTY;
        })
      )
    )
  );

  // state
  private state = signal<LoginState>({
    status: 'pending',
  });

  // selectors
  status = computed(() => this.state().status);

  constructor() {
    // reducers
    this.userAuthenticated$
      .pipe(takeUntilDestroyed())
      .subscribe(() =>
        this.state.update((state) => ({ ...state, status: 'success' }))
      );

    this.login$
      .pipe(takeUntilDestroyed())
      .subscribe(() =>
        this.state.update((state) => ({ ...state, status: 'authenticating' }))
      );

    this.error$
      .pipe(takeUntilDestroyed())
      .subscribe(() =>
        this.state.update((state) => ({ ...state, status: 'error' }))
      );
  }
}
