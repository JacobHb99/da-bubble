import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Channel } from '../models/channel.model';
import { Conversation } from '../models/conversation.model';
import { FirebaseService } from './firebase.service';
import { user } from '@angular/fire/auth';
type CurrentObject = 
  | { name: "user"; data: User }
  | { name: "channel"; data: Channel }
  | { name: "conversation"; data: Conversation };

@Injectable({
  providedIn: 'root'
})

export class SearchbarService {
  searchName: string = "";
  isInputEmpty: boolean = false;
 allObjects: CurrentObject[] = [];
  
  constructor(private firebaseService: FirebaseService) { }

  combineArraysWithTypes() {
    this.allObjects = [];

    // Umwandeln der Arrays und Pushen in das neue Array
    this.firebaseService.allUsers.forEach(user => {
      this.allObjects.push({ name: "user", data: user });
    });
    
    this.firebaseService.allChannels.forEach(channel => {
      this.allObjects.push({ name: "channel", data: channel });
    });
    
    this.firebaseService.allConversations.forEach(conversation => {
      this.allObjects.push({ name: "conversation", data: conversation });
    });
    console.log(this.allObjects);
    
  }


  emptyInput() {
    this.isInputEmpty = this.firebaseService.selectedUsers.length === 0;
  }

   get filteredUsers() {
    
    if (this.searchName.length < 1) {
      return [];
    }

    return this.allObjects.filter((obj: any) =>
    {
      if (obj.name == "user") {
      obj.data.username.toLowerCase().includes(this.searchName.toLowerCase())

       
      }
      
      if (obj.name == "channel") {
        obj.data.title.toLowerCase().includes(this.searchName.toLowerCase()) | 
        obj.data.description.toLowerCase().includes(this.searchName.toLowerCase())
      }
      // if (obj.name == "conversation") {
      //   obj.data.messages.toLowerCase().includes(this.searchName.toLowerCase())
      // }
    }
     
    );
  }
}
