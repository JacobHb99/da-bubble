import { Component, inject } from '@angular/core';
import { SingleMemberComponent } from './single-member/single-member.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ChannelService } from '../../services/channel.service';
import { user } from '@angular/fire/auth';
import { elementAt } from 'rxjs';
import { FirebaseService } from '../../services/firebase.service';
@Component({
  selector: 'app-show-member-in-channel',
  standalone: true,
  imports: [SingleMemberComponent, MatDialogModule],
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

  constructor() {
    this.channelService.currentChannel$.subscribe((channel) => {
      this.channel = channel;
      this.allUsersFromAChannelId = [];
      if (this.channel.users) {
        this.channel.users.forEach((user: any) => {
          this.allUsersFromAChannelId.push(user);
        });
      }
    });
    console.log(this.allUsersFromAChannelId);

    this.allUsersFromAChannelId.forEach((userId:any) => {
        this.user = this.firebaseService.getCurrentUser(userId);
       
        console.log("User");
      console.log(this.user);
       
        
      });
  
    
  }
}
