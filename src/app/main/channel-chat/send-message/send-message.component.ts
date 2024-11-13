import { Component, Input, inject } from '@angular/core';
import { Message } from '../../../models/message.model';
import { Thread } from '../../../models/thread.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SingleMessageComponent } from '../message-thread/single-message/single-message.component';
import { FirebaseService } from '../../../services/firebase.service';
import { AuthService } from '../../../services/auth.service';
import { Conversation } from '../../../models/conversation.model';
import { arrayUnion, updateDoc, addDoc, doc, collection, Firestore, onSnapshot, query, setDoc } from '@angular/fire/firestore';
import { v4 as uuidv4 } from 'uuid';
import { user } from '@angular/fire/auth';
import { User } from '../../../models/user.model';
import { ConversationService } from '../../../services/conversation.service';
import { InterfaceService } from '../../../services/interface.service';

@Component({
  selector: 'app-send-message',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './send-message.component.html',
  styleUrl: './send-message.component.scss'
})
export class SendMessageComponent {
 

  fiBaService = inject(FirebaseService);
  authService = inject(AuthService)
  firestore = inject(Firestore);
  conService = inject(ConversationService)
  uiService = inject(InterfaceService)

  @Input() placeholder: string = 'Nachricht an';

  currentRecipient: Conversation = new Conversation;
  text: string = '';
  currentMsg = new Message()
  loggedInUser = new User()


  async createNewMsg() {
    console.log('loggeduser', this.authService.currentUserSig());
    this.currentMsg = new Message();
    this.currentMsg.timeStamp = Date.now();
    this.currentMsg.senderId = this.authService.currentUserSig()?.uid;
    this.currentMsg.text = this.text,
      this.currentMsg.thread = new Thread(), //wird erstmal nicht erstellt (wegen array)
      this.currentMsg.reactions = [], //wird erstmal nicht erstellt (wegen array)
      //console.log('msg', this.currentMsg)
      await this.addMessage(this.currentMsg);
      this.text = '';
  }

  async addMessage(message: any) {
    const convId = this.fiBaService.currentConversation.conId;
    const msgData = this.getCleanJSON(message);
    msgData.msgId = uuidv4();
    //console.log('msgdata', msgData)
    const conversationRef = doc(this.firestore, `conversations/${convId}`);
    try {
      await updateDoc(conversationRef, {
        messages: arrayUnion(msgData)
      });
      console.log('Nachricht erfolgreich hinzugefügt');
      //this.conService.showUserChat()
    } catch (error) {
      console.error('Fehler beim Hinzufügen der Nachricht:', error);
    }
  }


getCleanJSON(message: Message) {
  return {
    msgId: message.msgId,
    timeStamp: message.timeStamp,
    senderId: message.senderId,
    //recipientId: message.recipientId,
    text: message.text,
    //thread: message.thread,
    //reactions: message.reactions
  };
}

getPlaceholderText() {
  if (this.uiService.content === 'newMessage') {
    return this.placeholder;
  } else if (this.fiBaService.user.username instanceof Conversation) {
    return `Nachricht an ${this.fiBaService.user.username}`;
  } else {
    return `Nachricht an # FEHLER`;
  }
}

}
