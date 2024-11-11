import { inject, Injectable } from '@angular/core';
import { doc, setDoc, Firestore, updateDoc, collection, onSnapshot, query } from '@angular/fire/firestore';
import { User } from '../models/user.model';
import { UserCredential } from '@angular/fire/auth';
import { where, } from "firebase/firestore";
import { Conversation } from '../models/conversation.model';
import { Channel } from '../models/channel.model';
import { signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
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

  constructor() { }


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
        this.allUsers.push(doc.data());
      });
      
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


