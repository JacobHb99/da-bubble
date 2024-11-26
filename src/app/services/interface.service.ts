import { Injectable, signal } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class InterfaceService {
  showThread = true;
  content: 'channelChat' | 'newMessage' | 'directMessage' = 'newMessage';
  showSidenav = signal(true);
  menuVisible = false;




  constructor() {}

  toggleSidenav() {
    this.menuVisible = !this.menuVisible
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