import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  standalone: true,
  templateUrl: './ctrlf.component.html',
  styleUrl: './ctrlf.component.scss',
  imports: [CommonModule],
})
export class CtrlfComponent {
  pdfViewerSrc: SafeResourceUrl | null = null;

  constructor(private sanitizer: DomSanitizer) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const fileURL = URL.createObjectURL(file);
      this.pdfViewerSrc = this.sanitizer.bypassSecurityTrustResourceUrl(
        `assets/pdfjs/web/viewer.html?file=${fileURL}`
      );
    }
  }
}
