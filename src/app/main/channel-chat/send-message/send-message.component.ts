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

@Component({
  selector: 'app-send-message',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './send-message.component.html',
  styleUrl: './send-message.component.scss'
})
export class SendMessageComponent {
  @Input() placeholder: string = '';

  fiBaService = inject(FirebaseService);
  authService = inject(AuthService)
  firestore = inject(Firestore);

  currentRecipient: Conversation = new Conversation;
  text: string = '';
  currentMsg = new Message()


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
    } catch (error) {
      console.error('Fehler beim Hinzufügen der Nachricht:', error);
    }
    this.updateThread()
  }

  updateThread() {
    let loggeduser = this.authService.currentUserSig();
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

}
