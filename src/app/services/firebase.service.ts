import { inject, Injectable } from '@angular/core';
import { doc, setDoc, Firestore } from '@angular/fire/firestore';
import { User } from '../models/user.model';

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
    await setDoc(doc(this.firestore, "users", userId), user);
  }
}
