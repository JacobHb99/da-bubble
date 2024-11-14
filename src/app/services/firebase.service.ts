import { forwardRef, Inject, inject, Injectable } from '@angular/core';
import { doc, setDoc, Firestore, updateDoc, collection, onSnapshot, query, arrayUnion, writeBatch, docData, DocumentData, QuerySnapshot } from '@angular/fire/firestore';
import { User } from '../models/user.model';
import { UserCredential } from '@angular/fire/auth';
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
  //allUsers: User[] = []; 
  allConversations: Conversation[] = [];
  allChannels: Channel[] = []; //besteht aus einem array von objekten des types channel + startet mit leerem array
  selectedUsers: any = []
  isClosed = false;
  user: any;
  currentConversation: Conversation = new Conversation();
  //currentConversation = signal<Conversation | null>(null)
  firestore = inject(Firestore);
  
  constructor() {}


  async assignUsersToChannel(chaId: string, currentChannel: any) {
    try {
      const channelRef = doc(this.firestore, `channels/${chaId}`);
      
      await updateDoc(channelRef, { users: this.allUsers, chaId: currentChannel.chaId } );
      console.log(this.allUsers);
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


  async setUserStatus(currentUser: UserCredential, status: string) {
    const userRef = doc(this.firestore, "users", currentUser.user.uid);
    await updateDoc(userRef, {
      status: status
    });
  }

  async addUsersToChannel(ChannelId: string) {
    const userRef = doc(this.firestore, "channels", ChannelId );
    await updateDoc(userRef, {
      users: this.selectedUsers
    });
  }



  async getAllUsers() {
    const q = query(collection(this.firestore, "users"));
    const unsubscribedUsers = onSnapshot(q, (querySnapshot) => {
      this.allUsers = [];
      querySnapshot.forEach((doc) => {
        let user = doc.data()

        this.allUsers.push(doc.data());
      });
    });
    
  }

  getCurrentUser(uid: string) {
    const unsub = onSnapshot(doc(this.firestore, "users", uid), (doc) => {
      console.log("Current data: ", doc.data());
      this.userObject = doc.data();
      console.log(this.userObject);
      
  });
  }

  async subscribeUserById(id: any) {
    const unsubscribedUser = onSnapshot(this.getUserDocRef(id), (user) => {
      this.user = this.setUserJson(user.data(), user.id);

    });
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


