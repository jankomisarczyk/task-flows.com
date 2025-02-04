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
            label: 'Fin & Econ',
            icon: 'pi pi-fw pi-chart-scatter',
            routerLink: ['/blog'],
          },
          {
            label: 'Philosophy',
            icon: 'pi pi-fw pi-building-columns',
            routerLink: ['/philosophy'],
          },
        ],
      },
      {
        label: 'Coding Projects',
        items: [
          {
            label: 'TaskFlow',
            icon: 'pi pi-fw pi-microchip-ai',
            url: ['https://task-flows.com'],
            target: '_blank',
          },
          {
            label: 'CTRL+F',
            icon: 'pi pi-fw pi-google',
            routerLink: ['/ctrlf'],
          },
          {
            label: 'FinanceBro',
            icon: 'pi pi-fw pi-microchip-ai',
            url: ['https://github.com/jankomisarczyk/FinanceBro'],
            target: '_blank',
          },
          {
            label: 'Polimaci',
            icon: 'pi pi-fw pi-desktop',
            url: ['https://polimaci.pl'],
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
            routerLink: ['/piano'],
          },
          {
            label: 'Calisthenics',
            icon: 'pi pi-fw pi-wave-pulse',
            routerLink: ['/calisthenics'],
          },
          {
            label: 'Playlist',
            icon: 'pi pi-fw pi-headphones',
            routerLink: ['/playlist'],
          },
          {
            label: 'Books',
            icon: 'pi pi-fw pi-book',
            routerLink: ['/books'],
          },
        ],
      },
    ];
  }
}
