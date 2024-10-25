import { inject, Injectable } from '@angular/core';
import { doc, setDoc, Firestore, updateDoc } from '@angular/fire/firestore';
import { User } from '../models/user.model';
import { UserCredential } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  firestore = inject(Firestore);

  constructor() { }


  async addUser(user: any) {
    const userId = user.uid;
    const userData = user.getJSON();
    console.log(user)
    await setDoc(doc(this.firestore, "users", userId), userData);
  }


  async setUserStatus(currentUser: UserCredential, status: string) {
    const userRef = doc(this.firestore, "users", currentUser.user.uid);
    await updateDoc(userRef, {
      status: status
    });
  }
}
