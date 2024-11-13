import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FirebaseService } from '../../services/firebase.service';
import { ChannelService } from '../../services/channel.service';
import { Channel } from '../../models/channel.model';
import { AuthService } from '../../services/auth.service';
import { doc, setDoc, Firestore, updateDoc, collection, onSnapshot, query } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-edit-channel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-channel.component.html',
  styleUrl: './edit-channel.component.scss'
})
export class EditChannelComponent implements OnInit {
  channel: Channel | undefined;
  isHoveredClose = false;
  editName: boolean = false;
  editDesc: boolean = false;
 changeName: string = "Bearbeiten";
 changeDesc: string = "Bearbeiten";
 descInput: string = "";
 titleInput: string = "";
 


  constructor(public dialogRef: MatDialogRef<EditChannelComponent>, public dialog: MatDialog, public channelService: ChannelService, private firestore: Firestore){}

  ngOnInit(): void {
    // Subscribes to channel data from ChannelService
    this.channelService.currentChannel$.subscribe((channel) => {
     
      if (channel) {
        this.channel = channel;
        this.descInput = channel.description;
        this.titleInput = channel.title;
       
        
        
      }
    });

    // Start listening for real-time updates from Firestore
    if (this.channel?.chaId) {
      this.channelService.listenToChannel(this.channel.chaId);
    }
  }

  async updateChannel() {
    if (this.channel) {
      console.log(this.channel.chaId);
      
      await this.channelService.updateChannel(this.channel.chaId, this.titleInput, this.descInput);
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
}