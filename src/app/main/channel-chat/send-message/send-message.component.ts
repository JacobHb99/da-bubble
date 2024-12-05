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
import { ChannelService } from '../../../services/channel.service';
import { Channel } from '../../../models/channel.model';
import { SearchbarService } from '../../../services/searchbar.service';

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
  channelService = inject(ChannelService)

  @Input() placeholder: string = '';
  @Input() isNewMsg: boolean = false;
  @Input() input: 'chat' | 'thread' | 'channel' | 'newMsg' | undefined;
  @ViewChild('emojiPicker', { static: false }) emojiPicker!: ElementRef;

  //currentRecipient: Conversation = new Conversation;
  text: string = '';
  isDisabled: boolean = true;
  showEmojiPicker = false;
  userList: boolean = false;
  currentMsg = new Message()
  loggedInUser = new User()


  constructor(public searchbarService: SearchbarService) {

  }

  async createNewMsg() {
    if (this.text.trim()) {
      if (this.input == 'chat' || this.input == 'channel') {
        let currentThreadId = await this.createThread(this.input);
        this.currentMsg = new Message();
        this.currentMsg.timeStamp = Date.now();
        this.currentMsg.senderId = this.authService.currentUserSig()?.uid;
        this.currentMsg.text = this.text,
          this.currentMsg.thread = currentThreadId, //wird erstmal nicht erstellt (wegen array)
          this.currentMsg.reactions = [], //wird erstmal nicht erstellt (wegen array)
          await this.addMessage(this.currentMsg);
      }

      if (this.input == 'thread') {
        this.currentMsg = new Message();
        this.currentMsg.timeStamp = Date.now();
        this.currentMsg.senderId = this.authService.currentUserSig()?.uid;
        this.currentMsg.text = this.text,
          this.currentMsg.reactions = [], //wird erstmal nicht erstellt (wegen array)
          this.currentMsg.parent = this.uiService.currentMessage
        await this.addThreadMessage(this.currentMsg);
      }

      if (this.input == 'newMsg') {
        this.createThreadsForAllReceivers();
      }

      this.checkemptyInput();
    }
  }

  async createThreadsForAllReceivers() {
    let currentThreadId: string = "";

    for (const receiver of this.uiService.selectedConversations) {
      if ('uid' in receiver) {
        currentThreadId = await this.createThread('newMsg', receiver);
      } else {
        currentThreadId = await this.createThread('newMsg', receiver);
      }
      this.currentMsg = new Message();
      this.currentMsg.timeStamp = Date.now();
      this.currentMsg.senderId = this.authService.currentUserSig()?.uid;
      this.currentMsg.text = this.text;
      this.currentMsg.thread = currentThreadId;
      this.currentMsg.reactions = [];
      // Logik zum Speichern oder Senden der Nachricht, falls erforderlich
      console.log('Thread erstellt für:', receiver);
      await this.addMessage(this.currentMsg, receiver);
    }
  }


  async createThread(input: 'chat' | 'channel' | 'newMsg', reciever?: Channel | User): Promise<string> {
    const currentUser = this.authService.currentUserSig();
    let objId: string = "";
    if (!currentUser) {
      console.error('Kein authentifizierter Benutzer gefunden');
      throw new Error('User not authenticated');
    }
    // `addDoc` nutzen, um den Thread hinzuzufügen
    if (input == 'chat') {
      objId = this.fiBaService.currentConversation.conId as string;
    } else if (input == 'channel') {
      objId = this.channelService.currentChannelSubject.value.chaId
    } else {
      if (reciever) {

        if ('uid' in reciever) {
          objId = this.conService.searchForConversation(reciever).conId as string
        } else {
          objId = reciever.chaId
        }
        let thread = this.getCleanThreadJSON(new Thread(), input, objId)
        const threadRef = await addDoc(collection(this.firestore, 'threads'), thread);
        // Zurückgegebene Thread-ID
        return threadRef.id;
      } else {
        let thread = this.getCleanThreadJSON(new Thread(), input, objId)
        const threadRef = await addDoc(collection(this.firestore, 'threads'), thread);
        // Zurückgegebene Thread-ID
        return threadRef.id;
      }
    }
    return ""
  }


  async addThreadMessage(message: Message) {
    const threadId = this.uiService.currentMessage.thread;
    const msgData = this.getCleanJSON(message);
    msgData.msgId = uuidv4();
    try {
      console.log(threadId);

      const threadRef = doc(this.firestore, "threads", threadId);
      // Füge die Nachricht in das "messages"-Array hinzu
      await updateDoc(threadRef, {
        messages: arrayUnion(msgData)
      });
      console.log('Nachricht erfolgreich hinzugefügt');
    } catch (error) {
      console.error('Fehler beim Hinzufügen der Nachricht:', error);
    }
  }


  async addMessage(message: any, receiver?: Channel | User) {
    let objId;
    let coll;
    let conversationId;
    if (this.uiService.content == 'channelChat') {
      console.log(this.channelService.currentChannel);

      objId = this.channelService.currentChannelSubject.value.chaId
      coll = 'channels'
    } else if (this.uiService.content == 'directMessage') {
      objId = this.fiBaService.currentConversation.conId;
      coll = 'conversations'
    } else {
      if (receiver) {
        if ('uid' in receiver) {
          objId = this.conService.searchForConversation(receiver).conId;
          coll = 'conversations'
        } else {
          objId = receiver.chaId;
          coll = 'channels'
        }
        this.emptyNewMsgSearch();
      }
    }
    const msgData = this.getCleanJSON(message);
    msgData.msgId = uuidv4();
    const conversationRef = doc(this.firestore, `${coll}/${objId}`);
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


  emptyNewMsgSearch() {
    this.searchbarService.newMsgSearchName = "";
    this.searchbarService.filteredResults = [];
  }


  getCleanJSON(message: Message) {
    return {
      msgId: message.msgId,
      timeStamp: message.timeStamp,
      senderId: message.senderId,
      //recipientId: message.recipientId,
      text: message.text,
      thread: message.thread,
      reactions: message.reactions,
      parent: message.parent
    };
  }

  getCleanThreadJSON(thread: Thread, input: string, objId: string) {
    return {
      id: thread.id,
      rootMessage: thread.rootMessage,
      messages: thread.messages,
      type: input,
      convId: objId
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

  toggleUserList() {
    this.userList = !this.userList;
  }

  tagUser(user: string) {
    this.text += "@" + user;
  }
}
