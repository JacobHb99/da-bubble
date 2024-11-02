import { Component, inject } from '@angular/core';
import { SendMessageComponent } from '../channel-chat/send-message/send-message.component';
import { MessageThreadComponent } from '../channel-chat/message-thread/message-thread.component';
import { InterfaceService } from '../../services/interface.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-thread',
  standalone: true,
  imports: [SendMessageComponent, MessageThreadComponent, CommonModule],
  templateUrl: './thread.component.html',
  styleUrl: './thread.component.scss'
})
export class ThreadComponent {
  uiService = inject(InterfaceService);

  constructor() {
    this.uiService.showThread = false;
  }

}
