import { HttpClient, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { inject, Injectable } from '@angular/core';
import { FirebaseService } from '../../../core/services/firebase/firebase.service';

export interface AgentTasks {
  agent: AgentInstruction;
  tasks: Task[];
}

interface AgentInstruction {
  agent: string;
  instructions: string;
  outputFiles: string[];
}

interface Task {
  name: string;
  arguments: { [key: string]: string };
}

interface FileMap {
  csv: string[];
  xlsx: string[];
  pdf: string[];
  txt: string[];
  docx: string[];
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  baseUrl = 'http://taskflow.endpoints.financebro-423409.cloud.goog/';
  private http = inject(HttpClient);
  private firebase = inject(FirebaseService);

  getAuthorizationHeader(token: string): HttpHeaders {
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getDecomposition(query: string): Observable<AgentTasks[]> {
    return this.firebase.getToken().pipe(
      switchMap((token) => {
        const headers = this.getAuthorizationHeader(token).append(
          'Content-Type',
          'text/plain'
        );
        return this.http.post<AgentTasks[]>(
          this.baseUrl + 'decomposition',
          query,
          {
            headers: headers,
          }
        );
      })
    );
  }

  executeTasks(agentTasks: AgentTasks[]): Observable<string[]> {
    return this.firebase.getToken().pipe(
      switchMap((token) => {
        const headers = this.getAuthorizationHeader(token);
        return this.http.post<string[]>(this.baseUrl + 'execute', agentTasks, {
          headers: headers,
        });
      })
    );
  }

  getAllFiles(): Observable<FileMap> {
    return this.firebase.getToken().pipe(
      switchMap((token) => {
        const headers = this.getAuthorizationHeader(token);
        return this.http.get<FileMap>(this.baseUrl + 'list_all_files', {
          headers: headers,
        });
      })
    );
  }

  uploadFile(file: File): Observable<HttpEvent<any>> {
    return this.firebase.getToken().pipe(
      switchMap((token) => {
        const formData = new FormData();
        formData.append('file', file);
        const headers = this.getAuthorizationHeader(token);
        return this.http.post(this.baseUrl + 'file-upload', formData, {
          headers: headers,
          reportProgress: true,
          observe: 'events',
        });
      })
    );
  }

  downloadFile(filename: string): Observable<HttpEvent<Blob>> {
    return this.firebase.getToken().pipe(
      switchMap((token) => {
        const headers = this.getAuthorizationHeader(token);
        return this.http.get(this.baseUrl + 'download/' + filename, {
          headers: headers,
          responseType: 'blob',
          observe: 'response',
        });
      })
    );
  }

  downloadOutputFile(filename: string): Observable<HttpEvent<Blob>> {
    return this.firebase.getToken().pipe(
      switchMap((token) => {
        const headers = this.getAuthorizationHeader(token);
        return this.http.get(this.baseUrl + 'download_output/' + filename, {
          headers: headers,
          responseType: 'blob',
          observe: 'response',
        });
      })
    );
  }

  deleteFile(filename: string): Observable<void> {
    return this.firebase.getToken().pipe(
      switchMap((token) => {
        const headers = this.getAuthorizationHeader(token);
        return this.http.delete<void>(this.baseUrl + 'delete/' + filename, {
          headers: headers,
        });
      })
    );
  }
}
