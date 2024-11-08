import { inject, Injectable } from '@angular/core';
import { addDoc, collection, Firestore, onSnapshot, query, setDoc } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { Channel } from '../models/channel.model';
import { DocumentData } from 'firebase/firestore';
import { FirebaseService } from './firebase.service';
import { SideNavComponent } from '../main/side-nav/side-nav.component';
import { ConversationService } from './conversation.service';
import { InterfaceService } from './interface.service';

@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  currentChannel = new Channel();
  firestore = inject(Firestore);
  firebaseService = inject(FirebaseService)
  uiService = inject(InterfaceService);
  conService = inject(ConversationService);

  allChannels!: Channel[];
 
  private allChannelsSubject = new BehaviorSubject<any>(null);
  selectedChannel = this.allChannelsSubject.asObservable();


  constructor(){
    this.getAllChannels();
  }

  showChannelChat(channel: any) {
    console.log(channel);
    this.setChannel(channel)
    this.uiService.changeContent('channelChat');
  }
 

async createChannel() {
  this.currentChannel.users = this.firebaseService.selectedUsers;
  const channelData = this.currentChannel.getJSON();
  const channelRef = await addDoc(collection(this.firestore, "channels"), channelData)
  this.firebaseService.addUsersToChannel(this.currentChannel.chaId)
    this.showChannelChat(this.currentChannel)
  

}

async getAllChannels() {
  const q = query(collection(this.firestore, "channels"));
  const unsubscribedChannel = onSnapshot(q, (querySnapshot) => {
  this.allChannels = [];
   querySnapshot.forEach((doc) => {
    this.convertData(doc.data(), doc.id)
   
});
});

}


  setChannel(user: any) {
    this.allChannelsSubject.next(user);
  }


  convertData(data: any, id: string ) {
     let newChannel = new Channel();
    newChannel.title = data['title'];
    newChannel.description = data['description'];
    newChannel.chaId = id;
    newChannel.creatorId = data['creatorId'];
    newChannel.users = data['users'];
    newChannel.messages = data['messages'];
    newChannel.comments = data['comments'];
    newChannel.reactions = data['reactions'];

    
    

    this.allChannels.push(newChannel)
  
    
  }
}


