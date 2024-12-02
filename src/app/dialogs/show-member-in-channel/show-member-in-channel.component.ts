import { Component, inject } from '@angular/core';
import { SingleMemberComponent } from './single-member/single-member.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ChannelService } from '../../services/channel.service';
import { user } from '@angular/fire/auth';
import { elementAt } from 'rxjs';
import { FirebaseService } from '../../services/firebase.service';
import { CommonModule } from '@angular/common';
import { BreakpointObserverService } from '../../services/breakpoint-observer.service';
import { ChannelChatComponent } from '../../main/channel-chat/channel-chat.component';
@Component({
  selector: 'app-show-member-in-channel',
  standalone: true,
  imports: [SingleMemberComponent, MatDialogModule, CommonModule],
  templateUrl: './show-member-in-channel.component.html',
  styleUrl: './show-member-in-channel.component.scss',
})
export class ShowMemberInChannelComponent {
  channel: any;
  allUsersFromAChannelId: any;
  allUsersFromAChannel: any;
  user:any;
  channelService = inject(ChannelService);
  firebaseService = inject(FirebaseService);
  channelChat = inject(ChannelChatComponent)

  constructor(
    public breakpointObserver: BreakpointObserverService

  ) {
    this.channelService.currentChannel$.subscribe(async (channel) => {
      this.channel = channel;
      this.allUsersFromAChannelId = [];
  
      if (this.channel.users) {
        this.allUsersFromAChannelId = [...this.channel.users]; // Nutzer-IDs kopieren
      }
  
      // Alle Benutzerinformationen laden
      try {
        const userPromises = this.allUsersFromAChannelId.map((userId: any) =>
          this.firebaseService.getCurrentUser(userId)
        );
  
        // Warten, bis alle Benutzerdaten geladen sind
        const users = await Promise.all(userPromises);
        console.log("Geladene Benutzer:", users);
        
        
  
        this.allUsersFromAChannelId = users; // Speichere Benutzer
      } catch (error) {
      }
    });
  }
  


}
