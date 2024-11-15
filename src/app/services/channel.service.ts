import { inject, Injectable } from '@angular/core';
import { updateDoc, addDoc, doc, collection, Firestore, onSnapshot, query, setDoc, collectionData, } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { Channel } from '../models/channel.model';
import { ConversationService } from './conversation.service';
import { InterfaceService } from './interface.service';
import { FirebaseService } from './firebase.service';
import { where } from 'firebase/firestore';
import { UserDataService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  currentChannel = new Channel();
  uiService = inject(InterfaceService);
  conService = inject(ConversationService);
  allChannels!: Channel[];
 // currentUser = this.authService.currentUserSig()?.uid

  private currentChannelSubject = new BehaviorSubject<Channel>(new Channel());
  currentChannel$ = this.currentChannelSubject.asObservable();

  constructor(private firestore: Firestore, private firebaseService: FirebaseService, private userService: UserDataService){
    this.getAllChannels();
  }



  listenToChannel(chaId: string) {
    const channelRef = doc(this.firestore, `channels/${chaId}`);
   
    onSnapshot(channelRef, (docSnapshot) => {
      console.log(docSnapshot.data());
      
      if (docSnapshot.exists()) {
        const updatedChannel = docSnapshot.data() as Channel;
        this.currentChannelSubject.next(updatedChannel); 
      }
    });
  }

  async updateChannel(channelId: string, title: string, description: string): Promise<void> {
    const channelRef1= doc(this.firestore, `channels/${channelId}`);
    await updateDoc(channelRef1, { title, description });
    
  }

  

  setCurrentChannel(channel: Channel) {
    this.currentChannelSubject.next(channel)
  }

  setChannel(user: any) {
    this.currentChannelSubject.next(user);
  }

  
  showChannelChat(channel: any) {
    this.setChannel(channel)
    this.setCurrentChannel(channel)
    this.uiService.changeContent('channelChat');
  }
 

  async createChannel(isSelected: boolean) {
    
    const newChannel = new Channel(); 
    newChannel.title = this.currentChannel.title; 
   
   // newChannel.creatorId = this.authService.currentUserSig()?.username ?? ""; 
    newChannel.users = isSelected ? this.firebaseService.selectedUsers : this.firebaseService.allUsersIds;
    newChannel.description = this.currentChannel.description;
    
    const channelData = newChannel.getJSON();
    console.log(channelData);
    const channelRef = await addDoc(collection(this.firestore, "channels"), channelData);
    
    
    newChannel.chaId = channelRef.id;
   
    
    
    
    if (isSelected) {
      await this.firebaseService.addUsersToChannel(newChannel.chaId);
    } else {
      await this.firebaseService.addAllUsersToChannel(newChannel.chaId, newChannel);
    }
    this.setCurrentChannel(newChannel); 
    this.showChannelChat(newChannel);
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


