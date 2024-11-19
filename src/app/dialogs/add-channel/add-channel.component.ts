import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { AddPeopleComponent } from '../add-people/add-people.component';
import { FormsModule } from '@angular/forms';
import { ChannelService } from '../../services/channel.service';
import { ConversationService } from '../../services/conversation.service';

@Component({
  selector: 'app-add-channel',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule],
  templateUrl: './add-channel.component.html',
  styleUrl: './add-channel.component.scss'
})
export class AddChannelComponent {
  isHoveredClose = false;
  channelName = "";
  

  constructor(public firebaseService: FirebaseService, public dialogRef: MatDialogRef<AddChannelComponent>, public dialog: MatDialog, public channelService: ChannelService){
    this.firebaseService.selectedUsers = [];
  }


  closeDialogChannel(): void {
    this.dialogRef.close(); 
  }

  

  
    openDialogAddPeople(): void {
      this.channelService.currentChannel.title = '';
      this.channelService.currentChannel.description = '';
      const dialogRef = this.dialog.open(AddPeopleComponent, {
        minWidth: '720px'
        
      });
      this.closeDialogChannel();
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
      });
    }
  
 
}
