import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { fetchEventSource, EventStreamContentType } from '@microsoft/fetch-event-source';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule,  HttpClientModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-frontend';
  messages: string[] = [];
  name: string = '';


  constructor(private http: HttpClient) { }

  async onSubmit(name: string): Promise<void> {
    class RetriableError extends Error { }
    class FatalError extends Error { }
    fetchEventSource('http://localhost:8080/hello', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            foo: name
        }),
        async onopen(response) {
            if (response.ok && response.headers.get('content-type') === EventStreamContentType) {
                return; // everything's good
            } else if (response.status >= 400 && response.status < 500 && response.status !== 429) {
                // client-side errors are usually non-retriable:
                throw new FatalError();
            } else {
                throw new RetriableError();
            }
        },
        onmessage(msg) {
            console.log(msg);
            if (msg.event === 'FatalError') {
                throw new FatalError(msg.data);
            }
        },
        onclose() {
            // if the server closes the connection unexpectedly, retry:
            console.log("closed ok");
        },
        onerror(err) {
            if (err instanceof FatalError) {
                throw err; // rethrow to stop the operation
            } else {
                // do nothing to automatically retry. You can also
                // return a specific retry interval here.
            }
        }
    });

}
}