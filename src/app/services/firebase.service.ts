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

  async getAllUsers() {
    const q = query(collection(this.firestore, "users"));
    const unsubscribedUsers = onSnapshot(q, (querySnapshot) => {
    this.allUsers = [];
     querySnapshot.forEach((doc) => {
      this.allUsers.push(doc.data());
  });
  console.log("Current cities in CA: ", this.allUsers);
});
}

toggleChannel() {
  this.isClosed = !this.isClosed;
  console.log(this.isClosed);
  

}
}
