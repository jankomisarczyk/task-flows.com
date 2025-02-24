/*!
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.dev/license
 */

import {DOCUMENT, isPlatformBrowser} from '@angular/common';
import {
  Component,
  inject,
  NgZone,
  OnInit,
  PLATFORM_ID,
  signal,
  WritableSignal,
} from '@angular/core';
import {NavigationEnd, NavigationSkipped, Router, RouterLink, RouterOutlet} from '@angular/router';
import {filter, map, skip} from 'rxjs/operators';
import {
  getActivatedRouteSnapshotFromRouter,
  IS_SEARCH_DIALOG_OPEN,
  WINDOW,
} from '@angular/docs';
import {ESCAPE, SEARCH_TRIGGER_KEY} from './core/constants/keys';

@Component({
  standalone: true,
  selector: 'adev-root',
  imports: [
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private readonly document = inject(DOCUMENT);
  private readonly ngZone = inject(NgZone);
  private readonly router = inject(Router);
  private readonly window = inject(WINDOW);

  currentUrl = signal('');
  displayFooter = signal(false);
  displaySecondaryNav = signal(false);
  displaySearchDialog: WritableSignal<boolean> = inject(IS_SEARCH_DIALOG_OPEN);

  isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  ngOnInit(): void {
    this.setSearchDialogVisibilityOnKeyPress();
    this.closeSearchDialogOnNavigationSkipped();
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        map((event) => event.urlAfterRedirects),
      )
      .subscribe((url) => {
        this.currentUrl.set(url);
        this.setComponentsVisibility();
        this.displaySearchDialog.set(false);
      });

    this.focusFirstHeadingOnRouteChange();
  }

  focusFirstHeading(): void {
    if (!this.isBrowser) {
      return;
    }

    const h1 = this.document.querySelector<HTMLHeadingElement>('h1');
    h1?.focus();
  }

  private setComponentsVisibility(): void {
    const activatedRoute = getActivatedRouteSnapshotFromRouter(this.router as any);

    this.displaySecondaryNav.set(activatedRoute.data['displaySecondaryNav']);
    this.displayFooter.set(!activatedRoute.data['hideFooter']);
  }

  private focusFirstHeadingOnRouteChange(): void {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        // Skip first emission, cause on the initial load we would like to `Skip to main content` popup when it's focused
        skip(1),
      )
      .subscribe(() => {
        this.focusFirstHeading();
      });
  }

  private setSearchDialogVisibilityOnKeyPress(): void {
    this.ngZone.runOutsideAngular(() => {
      this.window.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key === SEARCH_TRIGGER_KEY && (event.metaKey || event.ctrlKey)) {
          this.ngZone.run(() => {
            event.preventDefault();
            this.displaySearchDialog.update((display) => !display);
          });
        }

        if (event.key === ESCAPE && this.displaySearchDialog()) {
          this.ngZone.run(() => {
            event.preventDefault();
            this.displaySearchDialog.set(false);
          });
        }
      });
    });
  }

  private closeSearchDialogOnNavigationSkipped(): void {
    this.router.events.pipe(filter((event) => event instanceof NavigationSkipped)).subscribe(() => {
      this.displaySearchDialog.set(false);
    });
  }
}
