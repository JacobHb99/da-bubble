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
  previousMessage!: Message;



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


setMsg(currentMsg: Message) {
  this.currentMessage = currentMsg;
  this.firebaseService.listenToCurrentThreadChanges(currentMsg.thread);
  this.setThread(currentMsg)
}

setThread(currentMsg: Message) {
  let thread = this.findThread(currentMsg);
  let index: number;
  if (thread) {
    index = thread?.messages.length - 1;
    this.scrollInChat(thread.messages[index])
  }
}

scrollInChat(msg: Message) {
  // Sende die ID des Ziels an den Service
  const targetMessageId = `${msg.msgId}`;
  this.triggerScrollTo(targetMessageId);
}

findParentMsg(currentMsg: Message) {
  let msg = this.firebaseService.allThreads.find(u => u.id === currentMsg.thread);
}


findThread(currentMsg?: any) {
  let thread = this.firebaseService.allThreads.find(u => u.id === currentMsg.thread);
  return thread
}

findLastAnswer(currentMessage: Message) {
  let thread = this.findThread(currentMessage);
  let messages = thread?.messages;

  if (!messages || messages.length === 0) {
    return ; // Kein Eintrag, kein Ergebnis
  }

  return messages.reduce((latest, message) => 
    message.timeStamp > latest.timeStamp ? message : latest
  );
}

formatTimeFromTimestamp(timestamp?: number): string {
  let time : number;
  if (timestamp) {
    time = timestamp
  }else{
    time = 0
  }
  const date = new Date(time); // Erstelle ein Date-Objekt
  const hours = date.getHours().toString().padStart(2, '0'); // Stunden, 2-stellig
  const minutes = date.getMinutes().toString().padStart(2, '0'); // Minuten, 2-stellig
  return `${hours}:${minutes}`; // Kombiniere Stunden und Minuten
}

private scrollTrigger = new Subject<string>();
scrollTrigger$ = this.scrollTrigger.asObservable();

triggerScrollTo(elementId: string) {
  setTimeout(() => {
    this.scrollTrigger.next(elementId);
  }, 500);
}

}