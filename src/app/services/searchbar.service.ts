import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Channel } from '../models/channel.model';
import { Conversation } from '../models/conversation.model';
import { FirebaseService } from './firebase.service';
import { user } from '@angular/fire/auth';
import { AuthService } from './auth.service';
import { Thread } from '../models/thread.model';
type CurrentObject = 
  | { name: "user"; data: User }
  | { name: "channel"; data: Channel }
  | { name: "conversation"; data: Conversation }
  | { name: "channel-chat"; channelId: string; data: Channel}
  | { name: "thread";  data: Thread}

@Injectable({
  providedIn: 'root'
})

export class SearchbarService {
  searchName: string = "";
  newMsgSearchName: string = "";
  filteredResults: any[] = []; // Gefilterte Ergebnisse für neue
  isInputEmpty: boolean = false;
 allObjects: CurrentObject[] = [];
  
  constructor(private firebaseService: FirebaseService, private authService: AuthService) { }

  combineArraysWithTypes() {
    this.allObjects = [];

    // Umwandeln der Arrays und Pushen in das neue Array
    this.firebaseService.allUsers.forEach(user => {
      this.allObjects.push({ name: "user", data: user });
    });

    this.firebaseService.allChannels.forEach(channel => {
      this.allObjects.push({ name: "channel", data: channel });
      this.allObjects.push({ name: "channel-chat", channelId:channel.chaId, data: channel });
    });
    
    this.firebaseService.allConversations.forEach(conversation => {
      if (conversation.creatorId == (this.authService.currentUserSig()?.uid) || conversation.partnerId == (this.authService.currentUserSig()?.uid) ) {
        this.allObjects.push({ name: "conversation", data: conversation });
      }
    });

    this.firebaseService.allThreads.forEach(thread => {
        this.allObjects.push({ name: "thread", data: thread });
    });
    console.log(this.allObjects);
  }


  emptyInput() {
    this.isInputEmpty = this.firebaseService.selectedUsers.length === 0;
    this.searchName = "";
  }

  emptyMsgInput() {
    this.newMsgSearchName = "";
    this.filteredResults = [];
  }

  get filteredUsers() {
    if (this.searchName.trim().length < 1) {
      
      return [];
    }
  
    const searchTerm = this.searchName.toLowerCase();
    const results = this.allObjects.filter((obj: CurrentObject) => {
      
      
      if (obj.name === "user") {
        return obj.data.username.toLowerCase().includes(searchTerm) ; 
        
      }
  
      if (obj.name === "channel") {
        return (
          obj.data.title.toLowerCase().includes(searchTerm) ||
          obj.data.description.toLowerCase().includes(searchTerm)
        );
      }
  
      if (obj.name === "conversation") {
        console.log(obj.data.messages);
        
        return obj.data.messages.some((message: any) =>
          message.text.toLowerCase().includes(searchTerm)
        );
      }

      if (obj.name === "channel-chat") {
        console.log(obj.data.messages);
        
        return obj.data.messages.some((message: any) =>
          message.text.toLowerCase().includes(searchTerm)
        );
      }

      if (obj.name === "thread") {
        console.log(obj.data.messages);
        
        return obj.data.messages.some((message: any) =>
          message.text.toLowerCase().includes(searchTerm)
        );
      }
  
      return false;
    });
  
    console.log("Filtered Results:", results);
    return results;
  }


  newMsgSearch() {
    if (this.newMsgSearchName.startsWith('@')) {
      // Filter Benutzer bei '@'
      const searchTerm = this.newMsgSearchName.slice(1).toLowerCase();
      this.filteredResults = this.firebaseService.allUsers.filter(user =>
        user.username.toLowerCase().includes(searchTerm)
      );
    } else if (this.newMsgSearchName.startsWith('#')) {
      // Filter Channels bei '#'
      const searchTerm = this.newMsgSearchName.slice(1).toLowerCase();
      this.filteredResults = this.firebaseService.allChannels.filter(channel =>
        channel.title.toLowerCase().includes(searchTerm)
      );
    } else if (this.newMsgSearchName) {
      this.filteredResults = this.firebaseService.allUsers.filter(user =>
        user.email.toLowerCase().includes(this.newMsgSearchName)
      );
    }else{
      // Keine Filterbedingung, leer
      this.filteredResults = [];
    }
    console.log('RESULTS', this.filteredResults);
    console.log('MSG', this.newMsgSearchName);

    
  }
}
