import { Component,inject, OnInit } from '@angular/core';
import { SendMessageComponent } from './send-message/send-message.component';
import { MessageThreadComponent } from './message-thread/message-thread.component';
import { UserDataService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { InterfaceService } from '../../services/interface.service';
import { EditChannelComponent } from '../../dialogs/edit-channel/edit-channel.component';
import { MatDialog } from '@angular/material/dialog';
import { SingleMessageComponent } from './message-thread/single-message/single-message.component';
import { ChannelService } from '../../services/channel.service';
import { ShowMemberInChannelComponent } from '../../dialogs/show-member-in-channel/show-member-in-channel.component';
import { Firestore, doc, onSnapshot } from '@angular/fire/firestore';
import { AddToChoosenChannelComponent } from '../../dialogs/add-to-choosen-channel/add-to-choosen-channel.component';
import { ProfilComponent } from '../../dialogs/profil/profil.component';
import { BreakpointObserverService } from '../../services/breakpoint-observer.service';

@Component({
  selector: 'app-channel-chat',
  standalone: true,
  imports: [SingleMessageComponent,SendMessageComponent, MessageThreadComponent, CommonModule],
  templateUrl: './channel-chat.component.html',
  styleUrl: './channel-chat.component.scss'
})
export class ChannelChatComponent{
  user: any;
  threadIsEmpty = true;
  channel: any;
  uiService = inject(InterfaceService);
  channelService = inject(ChannelService)

  constructor(private userDataService: UserDataService,  public dialog: MatDialog, public breakpointObserver: BreakpointObserverService) {
    this.userDataService.selectedUser.subscribe((user) => {
      this.user = user;      
      
     
    
      this.uiService.changeContent('newMessage');
    }); 
    this.channelService.currentChannel$.subscribe((channel) => {
      this.channel = channel; 
   
      
           
     // this.uiService.changeContent('newMessage');
    }); 
    //console.log('active User', this.user.username)

  }



    openEditChannel(): void {
      const dialogRef = this.dialog.open(EditChannelComponent, {
        minWidth: '873px'
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    }

    openShowMembersDialog(){
      const dialogRef = this.dialog.open(ShowMemberInChannelComponent, {
      });
    }

    addToChoosenChannelDialog(){
      const dialogRef = this.dialog.open(AddToChoosenChannelComponent, {
      });
    }

    openUserProfilDialog(){
      const dialogRef = this.dialog.open(ProfilComponent, {
        data: this.user 
      });
    }




  
   
  

}
