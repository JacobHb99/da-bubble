import { Component, Input, inject, ElementRef, HostListener, ViewChild } from '@angular/core';
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
import { EmojiComponent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';

@Component({
  selector: 'app-send-message',
  standalone: true,
  imports: [CommonModule, FormsModule, EmojiComponent, PickerComponent],
  templateUrl: './send-message.component.html',
  styleUrl: './send-message.component.scss'
})
export class SendMessageComponent {


  fiBaService = inject(FirebaseService);
  authService = inject(AuthService)
  firestore = inject(Firestore);
  conService = inject(ConversationService)
  uiService = inject(InterfaceService)

  @Input() placeholder: string = '';
  @ViewChild('emojiPicker', { static: false }) emojiPicker!: ElementRef;

  //currentRecipient: Conversation = new Conversation;
  text: string = '';
  isDisabled: boolean = true;
  showEmojiPicker = false;
  currentMsg = new Message()
  loggedInUser = new User()


  async createNewMsg() {
    if (this.text.trim()) {
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
      this.checkemptyInput();
    }
  }

  async addMessage(message: any) {
    const convId = this.fiBaService.currentConversation.conId;
    const msgData = this.getCleanJSON(message);
    msgData.msgId = uuidv4();
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
      reactions: message.reactions
    };
  }

  checkemptyInput() {
    this.isDisabled = this.text.trim() === '';
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: Event) {
    // Prüfen, ob das Emoji-Picker-Element existiert und der Klick außerhalb davon war
    if (this.emojiPicker && !this.emojiPicker.nativeElement.contains(event.target)) {
      this.showEmojiPicker = false;
    }
  }

  addEmoji(event: any) {
    console.log(event);
    const emoji = event.emoji.native; 
    this.text += emoji;  
    //this.toggleEmojiPicker(); //sinnvoll??
  }
}
