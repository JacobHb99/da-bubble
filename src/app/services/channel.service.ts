import { inject, Injectable } from '@angular/core';
import { updateDoc, addDoc, doc, collection, Firestore, onSnapshot, query, setDoc, collectionData, } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { Channel } from '../models/channel.model';
import { ConversationService } from './conversation.service';
import { InterfaceService } from './interface.service';
import { FirebaseService } from './firebase.service';
import { where } from 'firebase/firestore';
import { UserDataService } from './user.service';
import { AuthService } from './auth.service';
import { SearchbarService } from './searchbar.service';

@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  currentChannel = new Channel();
  newChannel: Channel = new Channel(); // Für Erstellen
  uiService = inject(InterfaceService);
  conService = inject(ConversationService);
  allChannels!: Channel[];
 // currentUser = this.authService.currentUserSig()?.uid

  private currentChannelSubject = new BehaviorSubject<Channel>(new Channel());
  currentChannel$ = this.currentChannelSubject.asObservable();

  constructor(
    private firestore: Firestore, 
    private firebaseService: FirebaseService, 
    private userService: UserDataService, 
    private authService: AuthService,
    private searchbarSearvice: SearchbarService
  ){
    this.getAllChannels();
  }



  listenToChannel(chaId: string) { 
    const channelRef = doc(this.firestore, `channels/${chaId}`);
    
    const unsubscribe = onSnapshot(channelRef, (docSnapshot) => {
      
      
      if (docSnapshot.exists()) {
        const updatedChannel = docSnapshot.data() as Channel;
        this.currentChannelSubject.next(updatedChannel); 
        
        
      }
    });
   this.firebaseService.registerListener(unsubscribe);
  }

  async updateChannel(channelId: string, title: string, description: string): Promise<void> {
    if (!channelId) {
        console.error("Fehler: Keine gültige Channel-ID angegeben.");
        return;
    }

    const channelRef = doc(this.firestore, `channels/${channelId}`);
    
    try {
        await updateDoc(channelRef, { title, description });
        console.log("Channel erfolgreich aktualisiert:", channelId);
    } catch (error) {
        console.error("Fehler beim Aktualisieren des Channels:", error);
    }
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
    this.searchbarSearvice.emptyInput();
  }
 

  async createChannel(isSelected: boolean, currentUser: any) {
    const newChannel = new Channel(); 
    newChannel.title = this.currentChannel.title; 
    newChannel.creatorId = this.authService.currentUserSig()?.username ?? ""; 
    newChannel.users = isSelected ? this.firebaseService.selectedUsers : this.firebaseService.allUsersIds;
    newChannel.description = this.currentChannel.description;
    
    
    
    const channelData = newChannel.getJSON();
    const channelRef = await addDoc(collection(this.firestore, "channels"), channelData);
    newChannel.chaId = channelRef.id;
    console.log(newChannel);
    
   
    
  
    if (isSelected) {
      this.firebaseService.selectedUsers.push(currentUser)
      console.log(currentUser);
      await this.firebaseService.addUsersToChannel(newChannel.chaId);
      
      
      
    } else {
      await this.firebaseService.addAllUsersToChannel(newChannel.chaId, newChannel);
    }
    this.setCurrentChannel(newChannel); 
    this.showChannelChat(newChannel);


    
  }



  
async getAllChannels() {
  const q = query(collection(this.firestore, "channels"));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
  this.allChannels = [];
   querySnapshot.forEach((doc) => {
    this.convertData(doc.data(), doc.id)
});
});
this.firebaseService.registerListener(unsubscribe);
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


