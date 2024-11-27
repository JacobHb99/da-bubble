import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { ChannelService } from '../../services/channel.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-add-to-choosen-channel',
  standalone: true,
  imports: [MatDialogModule, FormsModule, CommonModule],
  templateUrl: './add-to-choosen-channel.component.html',
  styleUrl: './add-to-choosen-channel.component.scss'
})
export class AddToChoosenChannelComponent {
  channel: any;
  searchName: string = "";
  user: any = ""
  isInputEmpty = false;

  constructor(private channelService: ChannelService, public firebaseService: FirebaseService) {
    this.channelService.currentChannel$.subscribe((channel) => {
      this.channel = channel

    })
  }


  get filteredUsers() {
    if (this.searchName.length < 1) {
      return [];
    }

    return this.firebaseService.allUsers.filter((user: any) =>
      
      user.username.toLowerCase().includes(this.searchName.toLowerCase())
    
    );
   
    
  }

  addUser(user: any) {
    if (!this.firebaseService.selectedUsers.some((u: any ) => u.username === user.username)) {
      this.firebaseService.selectedUsers.push(user);
     this.emptyInput()
    } 
      this.searchName = "";
     this.emptyInput()
    }

    removeUser(user: any) {
      this.firebaseService.selectedUsers = this.firebaseService.selectedUsers.filter((u: any) => u.username !== user.username);
      this.emptyInput()
    }

    emptyInput() {
      this.isInputEmpty = this.firebaseService.selectedUsers.length === 0;
    }
}
