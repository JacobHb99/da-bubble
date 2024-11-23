import { Injectable, signal } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class InterfaceService {
  showThread = true;
  content: 'channelChat' | 'newMessage' | 'directMessage' = 'newMessage';
  showSidenav = signal(true);



  constructor() {}

  toggleSidenav() {
    this.showSidenav.set(!this.showSidenav());
  }

changeContent(content: 'channelChat' | 'newMessage' | 'directMessage'){
  this.content = content;
  
}

closeThread() {
  this.showThread = false;
}

openThread(){
  this.showThread = true;
}

}