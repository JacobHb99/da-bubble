import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class InterfaceService {
  showThread = true;
  content: 'channelChat' | 'newMessage' | 'directMessage' = 'newMessage';

  constructor() {}

changeContent(content: 'channelChat' | 'newMessage' | 'directMessage'){
  this.content = content;
  console.log('active Channel:', this.content)
}

closeThread() {
  this.showThread = false;
}

}