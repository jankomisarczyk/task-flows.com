import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './app.footer.component.html',
  standalone: true,
})
export class AppFooterComponent {
  layoutService: LayoutService = inject(LayoutService);
}
