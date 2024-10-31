import { Component } from '@angular/core';
import { SendMessageComponent } from './send-message/send-message.component';
import { MessageThreadComponent } from './message-thread/message-thread.component';
import { UserDataService } from '../../services/user.service';

@Component({
  selector: 'app-channel-chat',
  standalone: true,
  imports: [SendMessageComponent, MessageThreadComponent],
  templateUrl: './channel-chat.component.html',
  styleUrl: './channel-chat.component.scss'
})
export class ChannelChatComponent {
  user: any;

  constructor(private userDataService: UserDataService) {
    this.userDataService.selectedUser.subscribe((user) => {
      this.user = user;
    });

    //console.log('active User', user.username)
  }
}
