import { inject, Injectable } from '@angular/core';
import { doc, setDoc, Firestore, updateDoc, collection, onSnapshot, query } from '@angular/fire/firestore';
import { User } from '../models/user.model';
import { UserCredential } from '@angular/fire/auth';
import { where, } from "firebase/firestore";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  allUsers: any = []; // User[]
  selectedUsers: any = []
  isClosed = false;
  user:any;


  firestore = inject(Firestore);

  constructor() { }


  async addUser(user: any) {
    const userId = user.uid;
    const userData = user.getJSON();
    console.log(user)
    await setDoc(doc(this.firestore, "users", userId), userData);
  }


  async setUserStatus(currentUser: UserCredential, status: string) {
    console.log('logoutUser:', currentUser);
    
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

async subscribeUserById(id:string) {
  const unsubscribedUser = onSnapshot(this.getUserDocRef(id), (user) => {
    console.log(user.data());
    this.user =  this.setUserJson(user.data(),user.id);

});
}

toggleChannel() {
  this.isClosed = !this.isClosed;
  console.log(this.isClosed);
  

}

getUserDocRef(docId: string) {
  return doc(collection(this.firestore, 'users'),  docId);
}

setUserJson(object: any, id: string): any  {
  return {
    id: id,
    name: object.username,
    email: object.email,
    status:object.status,
    avatar:object.avatar
  }
}

}


