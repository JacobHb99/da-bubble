import { forwardRef, Inject, inject, Injectable } from '@angular/core';
import { doc, setDoc, Firestore, updateDoc, collection, onSnapshot, query, arrayUnion, writeBatch, docData, DocumentData, QuerySnapshot, where } from '@angular/fire/firestore';
import { User } from '../models/user.model';
import { Unsubscribe, UserCredential } from '@angular/fire/auth';
import { Conversation } from '../models/conversation.model';
import { Channel } from '../models/channel.model';
import { signal } from '@angular/core';
import { ChannelService } from './channel.service';
import { UserDataService } from './user.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  userObject!: DocumentData | undefined;
  allUsers: any = [];
  allUsersIds: any = [];
  //allUsers: User[] = []; 
  allConversations: Conversation[] = [];
  allChannels: Channel[] = []; //besteht aus einem array von objekten des types channel + startet mit leerem array
  selectedUsers: any = []
  public unsubscribeListeners: (() => void)[] = []; // Liste der Unsubscribe-Funktionen
  isUserChannelsListenerActive: boolean = false;
  isClosed = false;
  user: any;
  currentConversation: Conversation = new Conversation();
  //currentConversation = signal<Conversation | null>(null)
  firestore = inject(Firestore);
  
  constructor() {}

  unsubscribeAll() {
    console.log("Starte Unsubscribe aller Listener...");
    console.log(`Anzahl der registrierten Listener: ${this.unsubscribeListeners.length}`);


    this.unsubscribeListeners.forEach((unsub, index) => {
      try {
        unsub(); // Listener entfernen 
        console.log(`Listener ${index + 1} erfolgreich entfernt.`);
      } catch (error) {
        console.warn(`Fehler beim Entfernen von Listener ${index + 1}:, error`);
      }
    });
  
    this.unsubscribeListeners = []; // Liste leeren
    this.isUserChannelsListenerActive = false; // Flag zurücksetzen
    console.log("Alle Listener wurden erfolgreich entfernt.");
  }


  loadUserChannels(userUid: string) {
    if (!userUid) {
      console.error("Kein Benutzer angemeldet. Channels werden nicht geladen.");
      return;
    }
  
    if (this.isUserChannelsListenerActive) {
      console.warn("Listener für User Channels ist bereits aktiv. Abbruch.");
      return;
    }
  
    const channelsRef = collection(this.firestore, 'channels');
    const userChannelsQuery = query(channelsRef, where("users", "array-contains", userUid));
    this.allChannels = [];
    
    const unsubscribe = onSnapshot(userChannelsQuery, (snapshot) => {
     snapshot.forEach((doc) => {
      this.allChannels.push(doc.data() as Channel)
      console.log(this.allChannels);
      
      

     })
      console.log("Aktualisierte Channels:", this.allChannels);
    }, (error) => {
      console.error("Fehler beim Laden der Channels:", error);
    });
  
    this.registerListener(unsubscribe); // Listener registrieren
    this.isUserChannelsListenerActive = true; // Flag setzen
  }

  public registerListener(unsubscribeFn: () => void): void {
    this.unsubscribeListeners.push(unsubscribeFn);}


  async getAllUsers() {
    const q = query(collection(this.firestore, "users"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      this.allUsers = [];
      this.allUsersIds = [];
      querySnapshot.forEach((doc) => {
        let user = doc.data()

        this.allUsers.push(doc.data());
        this.allUsersIds.push(doc.id);
      });
    });
    this.registerListener(unsubscribe);
  }




  async assignUsersToChannel(chaId: string, currentChannel: any) {
    try {
      const channelRef = doc(this.firestore, `channels/${chaId}`);
      await updateDoc(channelRef, { users: this.allUsersIds, chaId: currentChannel.chaId } );
    
    } catch (error) {
    }
  }


   async addAllUsersToChannel(chaId: string, currentChannel: any) {
     await this.assignUsersToChannel(chaId, currentChannel)

  }


  async addUser(user: any) {
    const userId = user.uid;
    const userData = user.getJSON();
    
    await setDoc(doc(this.firestore, "users", userId), userData);
  }


  async setUserStatus(currentUser: UserCredential | null, status: string) {
    if (!currentUser || !currentUser.user) {
      console.warn("setUserStatus: currentUser oder user ist undefined.");
      return;
    }
  
    const userRef = doc(this.firestore, "users", currentUser.user.uid);
    try {
      await updateDoc(userRef, { status: status });
      console.log(`Status erfolgreich auf '${status}' gesetzt für Benutzer ${currentUser.user.uid}`);
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Status:", error);
    }
  }

  async addUsersToChannel(ChannelId: string) {
    const userRef = doc(this.firestore, "channels", ChannelId );
    await updateDoc(userRef, {
      users: this.selectedUsers
    });
  }



 

  getCurrentUser(uid: string) {
    const unsubscribe = onSnapshot(doc(this.firestore, "users", uid), (doc) => {
      this.userObject = doc.data();
      
  });
  this.registerListener(unsubscribe);
  }

  async subscribeUserById(id: any) {
    const unsubscribe = onSnapshot(this.getUserDocRef(id), (user) => {
      this.user = this.setUserJson(user.data(), user.id);

    });
    this.registerListener(unsubscribe);
  }

  async updateUser(user: any) {
    if (user.uid) {
      let docRef =this.getUserDocRef( user.uid);
      await updateDoc( docRef  ,  this.getUserAsCleanJson(user));
    
  }
  }

  toggleChannel() {
    this.isClosed = !this.isClosed;
   


  }

  getUserDocRef(docId:any) {
    return doc(collection(this.firestore, 'users'), docId);
  }

  setUserJson(object: any, id: string): any {
    return {
      uid: id,
      username: object.username,
      email: object.email,
      status: object.status,
      avatar: object.avatar,
      channels: object.channels,
      role: object.role
    }

  }

  getUserAsCleanJson(object:any):{} {
    return {
      uid: object.uid,
      username: object.username,
      email: object.email,
      status: object.status,
      avatar: object.avatar,
      channels: object.channels,
      role: object.role
    }
      }
}


