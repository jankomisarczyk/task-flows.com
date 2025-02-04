import { BehaviorSubject, Observable } from 'rxjs';

import { ChatDataService } from './chat-data.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  openai: any;

  messages: any[] = [];
  private messagesSubject = new BehaviorSubject<any[]>(
    []
  );

  constructor(private chatDataService: ChatDataService) {
    this.updateConfiguration();
  }

  public updateConfiguration(): void {
    const configuration: any = {
      apiKey: this.chatDataService.getAPIKeyFromLocalStore() ?? '',
      dangerouslyAllowBrowser: true
    };

    // this.openai = new OpenAI(configuration);
  }

  async createCompletionViaOpenAI(messages: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      this.openai.chat.completions.create(
        {
          model: 'gpt-4o',
          messages: messages,
        }
      ).then((message: unknown) => {
        resolve(message);
      }).catch((err: any) => {
        reject(err);
      })
    })
  }

  async getTitleFromChatGpt(messages: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      this.openai.chat.completions.create(
        {
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: `create a max 10 character title from below messages. ${JSON.stringify(
                messages
              )}`,
            },
          ],
        }
      ).then((message: unknown) => {
        resolve(message)
      }).catch((err: any) => {
        reject(err);
      })
    })
  }

  public setMessagesSubject(event: any[]) {
    this.messagesSubject.next(event);
  }

  public getMessagesSubject(): Observable<any[]> {
    return this.messagesSubject.asObservable();
  }
}
