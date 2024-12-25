import { Component, effect, inject } from '@angular/core';
import { AgentTasks, ChatService } from './services/chat.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass, NgStyle } from '@angular/common';
import {
  HttpEventType,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { FirebaseService } from '../../core/services/firebase/firebase.service';
import { Router } from '@angular/router';

// @NgModule({
//   declarations: [ChatContentComponent],
//   exports: [ChatContentComponent],
//   providers: [ApiKeyService, MarkdownService, ChatService, MatSnackBar],
// })
// export class ChatContentModule {
// }

interface Message {
  content: string;
  isUser: boolean;
}

@Component({
  standalone: true,
  selector: 'app-chat',
  // imports: [MatFormFieldModule, MatInputModule, MatIconModule, FormsModule],
  imports: [CommonModule, NgStyle],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ChatComponent {
  isSideBarVisible: boolean = false;
  isUserMenuVisible: boolean = false;
  isUserMenuAnimating: boolean = false;
  progress: { percentage: number } = { percentage: 0 };

  messages: Message[] = [];
  agentTasks: AgentTasks[] = [];
  outputfiles: string[] = [];

  csvFiles: string[] = ['some.csv'];
  xlsxFiles: string[] = [];
  pdfFiles: string[] = [];
  txtFiles: string[] = [];
  docxFiles: string[] = [];

  private chatService = inject(ChatService);
  authService = inject(FirebaseService);
  private router = inject(Router);

  constructor() {
    effect(() => {
      if (!this.authService.user()) {
        this.router.navigate(['auth', 'login']);
      }
    });
    this.getAllUploadedFiles();
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      this.progress.percentage = 1;

      this.chatService.uploadFile(file).subscribe({
        next: (event) => {
          console.log(event);
          this.reportProgress(event);
        },
        error: (error: HttpErrorResponse) => {
          console.log('kurwa jest error na koniec');
          this.progress.percentage = 0;
          console.log(error);
        },
        complete: () => {
          console.log('Upload complete');
          this.progress.percentage = 0;
          this.getAllUploadedFiles();
        },
      });
    }
  }

  private reportProgress(event: any): void {
    if (event.type === HttpEventType.UploadProgress) {
      console.log('File is being uploaded');
      this.progress.percentage = Math.round(
        (100 * event.loaded) / (event.total || 1)
      );
    }
  }

  downloadFile(file: string): void {
    console.log('Downloading file: ' + file);
    this.chatService.downloadFile(file).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.Response) {
          const filename =
            event.headers.get('Content-Disposition')?.split('=')[1] || file;
          const blob = event.body as Blob;
          const a = document.createElement('a');
          a.download = filename;
          a.href = URL.createObjectURL(blob);
          a.click();
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error downloading file: ' + JSON.stringify(error));
      },
    });
  }

  downloadOutputFile(file: string): void {
    console.log('Downloading Output file: ' + file);
    this.chatService.downloadOutputFile(file).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.Response) {
          const filename =
            event.headers.get('Content-Disposition')?.split('=')[1] || file;
          const blob = event.body as Blob;
          const a = document.createElement('a');
          a.download = filename;
          a.href = URL.createObjectURL(blob);
          a.click();
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error downloading file: ' + JSON.stringify(error));
      },
    });
  }

  deleteFile(filename: string): void {
    console.log('Deleting file: ' + filename);
    this.chatService.deleteFile(filename).subscribe({
      next: () => {
        console.log('File deleted: ' + filename);
        this.getAllUploadedFiles();
      },
      error: (err: HttpErrorResponse) =>
        console.error('Error deleting file: ' + JSON.stringify(err)),
    });
  }

  getAllUploadedFiles(): void {
    this.chatService.getAllFiles().subscribe({
      next: (data) => {
        this.csvFiles = data.csv;
        this.xlsxFiles = data.xlsx;
        this.pdfFiles = data.pdf;
        this.txtFiles = data.txt;
        this.docxFiles = data.docx;
      },
      error: (err) =>
        console.error('Error fetching files: ' + JSON.stringify(err)),
    });
  }

  getAgentTasks(query: string): void {
    this.messages.push({ content: query, isUser: true });
    setTimeout(() => {
      this.agentTasks = [
        {
          agent: {
            agent: 'Economic Analyst Agent',
            instructions:
              'Search for relevant economic literature on the topic of economic growth and save the results as .pdf files.',
            outputFiles: ['economic_growth_literature.pdf'],
          },
          tasks: [
            {
              name: 'searchEconLiterature',
              arguments: {
                query: 'economic growth',
                saveAs: 'economic_growth_literature.pdf',
              },
            },
          ],
        },
      ];
      this.messages.push({
        content:
          'Successfully completed - Please look on the right side for the plan of execution.',
        isUser: false,
      });
    }, 1500);
    // this.chatService.getDecomposition(query).subscribe({
    //   next: data => this.agentTasks = data,
    //   error: err => this.messages.push({content: err.message, isUser: false}),
    //   complete: () => this.messages.push({content: 'Successfully completed - Please look on the right side for the plan of execution.', isUser: false}),
    // });
  }

  execute(): void {
    // this need to be SSE (with different event_type ids) but for now it is POST

    // + it could return only text reply without any file :/
    this.chatService.executeTasks(this.agentTasks).subscribe({
      next: (data) => {
        this.outputfiles = data;
      },
      error: (err: HttpErrorResponse) =>
        console.error('Error executing tasks: ' + JSON.stringify(err)),
    });
  }

  toggleNav(): void {
    this.isSideBarVisible = !this.isSideBarVisible;
  }

  toggleUserMenu(): void {
    if (this.isUserMenuVisible) {
      this.isUserMenuVisible = false;
      setTimeout(() => {
        this.isUserMenuAnimating = false;
      }, 200);
    } else {
      this.isUserMenuAnimating = true;
      setTimeout(() => {
        this.isUserMenuVisible = true;
      }, 50);
    }
  }
}
