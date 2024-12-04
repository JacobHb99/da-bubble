import { ChangeDetectorRef, Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { Message } from '../models/message.model';
import { FirebaseService } from './firebase.service';
import { Thread } from '../models/thread.model';
import { MatDialog } from '@angular/material/dialog';
import { ShowMemberInChannelComponent } from '../dialogs/show-member-in-channel/show-member-in-channel.component';
import { AddToChoosenChannelComponent } from '../dialogs/add-to-choosen-channel/add-to-choosen-channel.component';
import { BreakpointObserverService } from './breakpoint-observer.service';
import { Channel } from '../models/channel.model';
import { User } from '../models/user.model';
@Injectable({
  providedIn: 'root',
})
export class InterfaceService {
  showThread = false;
  content: 'channelChat' | 'newMessage' | 'directMessage' = 'newMessage';
  showSidenav = signal(true);
  menuVisible = false;
  currentMessage: Message = new Message();
  currentThread: Thread | undefined;
  previousMessage!: Message;
  currChannel!: Channel;
  selectedConversations: (User | Channel)[] = [];




  constructor(private firebaseService: FirebaseService, public dialog: MatDialog, public breakpointObserver: BreakpointObserverService) {
    
  }
  
    // Type Guard zur Unterscheidung von User und Channel
    isUser(obj: User | Channel): obj is User {
      return 'uid' in obj;
    }

    isChannel(obj: User | Channel): obj is Channel {
      return 'chaId' in obj;
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
  this.openThread()
}

setThread(currentMsg: Message) {
  let thread = this.findThread(currentMsg);
  let index: number;
  if (thread) {
    index = thread?.messages.length - 1;
    if (thread?.messages.length > 0) {
      this.scrollInChat(thread.messages[index])

    }
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

openShowMembersDialog() {
  const dialogRef = this.dialog.open(ShowMemberInChannelComponent, {
    width: "100%",
    maxWidth: '873px'
  });
}

openChannelDialog() {
  if (this.breakpointObserver.isXSmallOrSmall) {
    this.openShowMembersDialog();
  } else {
    this.addToChoosenChannelDialog();
  }
}

addToChoosenChannelDialog() {
  const dialogRef = this.dialog.open(AddToChoosenChannelComponent, {
    width: "100%",
    maxWidth: '873px'
  });
}

private scrollTrigger = new Subject<string>();
scrollTrigger$ = this.scrollTrigger.asObservable();

triggerScrollTo(elementId: string) {
  setTimeout(() => {
    this.scrollTrigger.next(elementId);
  }, 500);
}

}