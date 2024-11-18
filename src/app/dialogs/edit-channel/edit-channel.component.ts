import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FirebaseService } from '../../services/firebase.service';
import { ChannelService } from '../../services/channel.service';
import { Channel } from '../../models/channel.model';
import { AuthService } from '../../services/auth.service';
import { doc, setDoc, Firestore, updateDoc, collection, onSnapshot, query } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { UserDataService } from '../../services/user.service';
import { User } from '../../models/user.model';


@Component({
  selector: 'app-edit-channel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-channel.component.html',
  styleUrl: './edit-channel.component.scss'
})
export class EditChannelComponent implements OnInit {
  channel: Channel | undefined;
  channels: any[] = []
  isHoveredClose = false;
  editName: boolean = false;
  editDesc: boolean = false;
 changeName: string = "Bearbeiten";
 changeDesc: string = "Bearbeiten";
 descInput: string = "";
 titleInput: string = "";
 channelId: string = "";
 currentUser: any;
 isEditing: boolean = false;
 


  constructor(public dialogRef: MatDialogRef<EditChannelComponent>, public dialog: MatDialog, public channelService: ChannelService , private userService: UserDataService, private authService: AuthService, private firebaseService: FirebaseService){}

  ngOnInit(): void {
    // Subscribes to channel data from ChannelService
    this.channelService.currentChannel$.subscribe((channel) => {
     
      if (!this.isEditing && channel) {
        this.channel = channel;
        this.descInput = channel.description;
        this.titleInput = channel.title;
        this.channelId = channel.chaId;
      }
    });
    this.channelService.listenToChannel(this.channelId);
  }
    
   
async updateChannel() {
  if (this.channel) {
    this.isEditing = true; // Bearbeitung wird gestartet
    try {
      await this.channelService.updateChannel(this.channel.chaId, this.titleInput, this.descInput);
     

      this.channel.title = this.titleInput;
      this.channel.description = this.descInput;
    } catch (error) {
     
    } finally {
      this.isEditing = false; // Bearbeitung abgeschlossen
    }
  }
}

  

   closeEditChannel(): void {
    this.dialogRef.close()
   }




   editChannelName() {
    console.log(this.editName);
    if (this.editName) {
      this.changeName = 'Speichern'
      
    } else {
      this.changeName = 'Bearbeiten'
    }
    this.updateChannel();
   }

   editChannelDesc() {
    console.log(this.editDesc);
    if (this.editDesc) {
      this.changeDesc = 'Speichern'
      
    } else {
      this.changeDesc = 'Bearbeiten'
    }
    this.updateChannel();
   }



   leaveChannel(currentUser: User) {
    console.log(currentUser);
    console.log(this.firebaseService.allUsers);
   }
}