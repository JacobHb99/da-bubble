import { Component } from '@angular/core';
import { SendMessageComponent } from './send-message/send-message.component';
import { MessageThreadComponent } from './message-thread/message-thread.component';

@Component({
  selector: 'app-channel-chat',
  standalone: true,
  imports: [SendMessageComponent, MessageThreadComponent],
  templateUrl: './channel-chat.component.html',
  styleUrl: './channel-chat.component.scss'
})
export class ChannelChatComponent {

}
