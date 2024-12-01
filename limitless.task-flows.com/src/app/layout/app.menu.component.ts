import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ImageModule } from 'primeng/image';
import { AppMenuitemComponent } from './app.menuitem.component';
import { LayoutService } from './service/app.layout.service';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
  standalone: true,
  imports: [CommonModule, AppMenuitemComponent, ImageModule],
})
export class AppMenuComponent implements OnInit {
  model: any[] = [];

  constructor(public layoutService: LayoutService) {}

  ngOnInit() {
    this.model = [
      {
        label: 'Home',
        items: [
          { label: 'About me', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
        ],
      },
      {
        label: 'Blog',
        items: [
          {
            label: 'Finance',
            icon: 'pi pi-fw pi-wallet',
            routerLink: ['/blog/finance'],
          },
          {
            label: 'Economics',
            icon: 'pi pi-fw pi-chart-scatter',
            url: ['https://www.primefaces.org/primeflex/'],
            target: '_blank',
          },
          {
            label: 'Philosophy',
            icon: 'pi pi-fw pi-building-columns',
            url: ['https://www.primefaces.org/primeflex/'],
            target: '_blank',
          },
        ],
      },
      {
        label: 'Coding Projects',
        items: [
          {
            label: 'TaskFlow',
            icon: 'pi pi-fw pi-microchip-ai',
            routerLink: ['/blocks'],
            badge: 'NEW',
          },
          {
            label: 'CTRL+F',
            icon: 'pi pi-fw pi-google',
            routerLink: ['/blocks'],
            badge: 'NEW',
          },
          {
            label: 'FinanceBro',
            icon: 'pi pi-fw pi-microchip-ai',
            url: ['https://www.primefaces.org/primeblocks-ng'],
            target: '_blank',
          },
          {
            label: 'Polimaci',
            icon: 'pi pi-fw pi-desktop',
            url: ['https://www.primefaces.org/primeblocks-ng'],
            target: '_blank',
          },
        ],
      },
      {
        label: 'Other hobbies',
        items: [
          {
            label: 'Piano',
            icon: 'pi pi-fw pi-heart',
            routerLink: ['/hobby/piano'],
          },
          {
            label: 'Calisthenics',
            icon: 'pi pi-fw pi-wave-pulse',
            routerLink: ['/calisthenics'],
          },
          {
            label: 'Gym',
            icon: 'pi pi-fw pi-check-square',
            routerLink: ['/sport/gym'],
          },
          {
            label: 'Playlist',
            icon: 'pi pi-fw pi-headphones',
            routerLink: ['/hobby/playlist'],
          },
          {
            label: 'Books',
            icon: 'pi pi-fw pi-book',
            routerLink: ['/hobby/books'],
          },
        ],
      },
    ];
  }
}
