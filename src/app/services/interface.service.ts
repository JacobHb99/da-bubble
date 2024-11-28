import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { Message } from '../models/message.model';
import { FirebaseService } from './firebase.service';
import { Thread } from '../models/thread.model';
@Injectable({
  providedIn: 'root',
})
export class InterfaceService {
  showThread = true;
  content: 'channelChat' | 'newMessage' | 'directMessage' = 'newMessage';
  showSidenav = signal(true);
  menuVisible = false;
  currentMessage: Message = new Message();
  currentThread: Thread | undefined;



  constructor(private firebaseService: FirebaseService) {
    
  }

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

setMsg(currentMsg: any) {
  this.currentMessage = currentMsg;
  this.findThread();
}

findThread() {
  this.currentThread = this.firebaseService.allThreads.find(u => u.id === this.currentMessage.thread);
  console.log(this.currentThread);
}

private scrollTrigger = new Subject<string>();
scrollTrigger$ = this.scrollTrigger.asObservable();

triggerScrollTo(elementId: string) {
  this.scrollTrigger.next(elementId);
}

}