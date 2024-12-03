import { Component, Inject, inject, OnInit } from '@angular/core';
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
import { FirebaseService } from '../../services/firebase.service';


@Component({
  selector: 'app-channel-chat',
  standalone: true,
  imports: [SingleMessageComponent, SendMessageComponent, MessageThreadComponent, CommonModule],
  templateUrl: './channel-chat.component.html',
  styleUrl: './channel-chat.component.scss'
})
export class ChannelChatComponent {
  user: any;
  threadIsEmpty = true;
  channel: any;
  uiService = inject(InterfaceService);
  channelService = inject(ChannelService)
  allUsersFromAChannel: any;
  firebaseService = inject(FirebaseService);
  ;

  constructor(public userDataService: UserDataService, public dialog: MatDialog, public breakpointObserver: BreakpointObserverService) {
    this.userDataService.selectedUser.subscribe((user) => {
      this.user = user;



      this.uiService.changeContent('newMessage');
    });
    this.channelService.currentChannel$.subscribe(async (channel) => {
      this.channel = channel;
      this.uiService.currChannel = channel;
      console.log('CHANNELS', this.uiService.currChannel);
      
      if (this.channel.users) {
        this.allUsersFromAChannel = [...this.channel.users]; // Nutzer-IDs kopieren
      }
      try {
        const userPromises = this.allUsersFromAChannel.map((userId: any) =>
          this.firebaseService.getCurrentUser(userId)
        );

        // Warten, bis alle Benutzerdaten geladen sind
        const users = await Promise.all(userPromises);
        console.log("Geladene Benutzer:", users);



        this.allUsersFromAChannel = users; // Speichere Benutzer
      } catch (error) {
      }






      // this.uiService.changeContent('newMessage');
    });
    //console.log('active User', this.user.username)

  }



  openEditChannel(): void {
    const dialogRef = this.dialog.open(EditChannelComponent, {
      width: "100%",
      maxWidth: '873px'
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openShowMembersDialog() {
    const dialogRef = this.dialog.open(ShowMemberInChannelComponent, {
      width: "100%",
      maxWidth: '873px'
    });
  }

  openChannelDialog() {
    if (this.breakpointObserver.isXSmallOrSmall) {
      this.openShowMembersDialog();
    } else {
      this.addToChoosenChannelDialog();
    }
  }

  addToChoosenChannelDialog() {
    const dialogRef = this.dialog.open(AddToChoosenChannelComponent, {
      width: "100%",
      maxWidth: '873px'
    });
  }

  openUserProfilDialog() {
    const dialogRef = this.dialog.open(ProfilComponent, {
      data: this.user
    });
  }

  getFirstNElements(n: number, array: any): any[] {
    return array.slice(0, Math.min(array.length, n));
  }






}
