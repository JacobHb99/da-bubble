import { Component,inject, OnInit } from '@angular/core';
import { SendMessageComponent } from './send-message/send-message.component';
import { MessageThreadComponent } from './message-thread/message-thread.component';
import { UserDataService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { InterfaceService } from '../../services/interface.service';

@Component({
  selector: 'app-channel-chat',
  standalone: true,
  imports: [SendMessageComponent, MessageThreadComponent, CommonModule],
  templateUrl: './channel-chat.component.html',
  styleUrl: './channel-chat.component.scss'
})
export class ChannelChatComponent{
  user: any;
  uiService = inject(InterfaceService);

  constructor(private userDataService: UserDataService) {
    this.userDataService.selectedUser.subscribe((user) => {
      this.user = user;      
      this.uiService.changeContent('newMessage');
    });    
    //console.log('active User', this.user.username)
    
  }

}
