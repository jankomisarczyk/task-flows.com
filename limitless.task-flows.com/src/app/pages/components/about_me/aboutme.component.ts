import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';

@Component({
  standalone: true,
  animations: [
    trigger('videoAnimation', [
      state(
        'hidden',
        style({
          opacity: 0,
        })
      ),
      state(
        'shown',
        style({
          opacity: 1,
        })
      ),
      transition('hidden => shown', [animate('0.5s ease-in')]),
    ]),
    trigger('logoAnimation', [
      state(
        'hidden',
        style({
          transform: 'translate3d(0px, 110%, 0px)',
        })
      ),
      state(
        'shown',
        style({
          transform: 'translate3d(0px, 0%, 0px)',
        })
      ),
      transition('hidden => shown', [animate('0.7s 0.5s ease-in')]),
    ]),
    trigger('japaneseAnimation', [
      state(
        'hidden',
        style({
          opacity: 0,
          // transform: 'translate3d(0px, 110%, 0px)',
        })
      ),
      state(
        'shown',
        style({
          opacity: 1,
          // transform: 'translate3d(0px, 0%, 0px)',
        })
      ),
      transition('hidden => shown', [animate('1s 1.5s ease-in')]),
    ]),
  ],
  templateUrl: './aboutme.component.html',
  styleUrls: ['./aboutme.component.scss'],
  imports: [CommonModule],
})
export class AboutMeComponent implements AfterViewInit {
  state = 'hidden';
  state2 = 'hidden';
  state3 = 'hidden';

  ngAfterViewInit() {
    setTimeout(() => {
      this.state = 'shown';
    }, 100);
    setTimeout(() => {
      this.state2 = 'shown';
    }, 100);
    setTimeout(() => {
      this.state3 = 'shown';
    }, 100);
  }
}
