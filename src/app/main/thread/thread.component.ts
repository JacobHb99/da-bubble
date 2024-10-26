import { Component } from '@angular/core';
import { SendMessageComponent } from '../channel-chat/send-message/send-message.component';
import { MessageThreadComponent } from '../channel-chat/message-thread/message-thread.component';

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [SendMessageComponent, MessageThreadComponent],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss'
})
export class ThreadComponent {

}
