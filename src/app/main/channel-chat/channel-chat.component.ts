import { Component } from '@angular/core';
import { SendMessageComponent } from './send-message/send-message.component';
import { MessageThreadComponent } from './message-thread/message-thread.component';
import { UserDataService } from '../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-channel-chat',
  standalone: true,
  imports: [SendMessageComponent, MessageThreadComponent,CommonModule],
  templateUrl: './channel-chat.component.html',
  styleUrl: './channel-chat.component.scss'
})
export class ChannelChatComponent {
  user: any;
  isChannelChat: boolean = false;

  constructor(private userDataService: UserDataService) {
    this.userDataService.selectedUser.subscribe((user) => {
      this.user = user;
    });

    //console.log('active User', user.username)
  }
}
