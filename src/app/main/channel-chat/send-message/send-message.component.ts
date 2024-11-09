import { Component, Input, inject } from '@angular/core';
import { Message } from '../../../models/message.model';
import { Thread } from '../../../models/thread.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SingleMessageComponent } from '../message-thread/single-message/single-message.component';
import { FirebaseService } from '../../../services/firebase.service';
import { AuthService } from '../../../services/auth.service';

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

  text: string = '';
  message = new Message()


  sendMessage() {
    this.message=
    new Message({
      timeStamp: Date.now(),
      senderId: this.authService.currentUserSig()?.uid,
      text: this.text,
      thread: new Thread(),
      reactions: []
    });
    console.log('msg', this.message)
    console.log('msg', this.fiBaService.currentConversation)
  }

  async addMessage(message: any) {
    const msgData = this.message.getJSON(message);
    // const msgnRef = await addDoc(collection(this.firestore, "conversations"), msgData)
    // msgData.msgId = msgRef.id,
    //     await setDoc(msgRef, msgData).catch((err) => {
    //         console.log('Error adding Conversation to firebase', err);
    //     });
    //this.getAllConversations();       
}

// getCleanJSON(message: Message) {
//   return {
//       conId: conversation.conId,
//       creatorId: conversation.creatorId,
//       partnerId: conversation.partnerId,
//       messages: conversation.messages,
//       active: conversation.active,
//   };
// }

}
