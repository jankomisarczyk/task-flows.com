import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ButtonsComponent } from '../buttons/buttons.component';
import { ChatContentComponent } from '../chat-content/chat-content.component';
import { FormsModule } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NavbarTitleComponent } from '../navbar-title/navbar-title.component';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { UserDialogComponent } from './user-dialog.component';
import { CommonModule } from '@angular/common';
import {NgFor, NgIf} from '@angular/common';

@NgModule({
  exports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatInputModule,
    ReactiveFormsModule,
  ]
})
export class ChatModule {}
