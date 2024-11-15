import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { arrayUnion, doc, DocumentData, Firestore, updateDoc, writeBatch } from '@angular/fire/firestore';
import { FirebaseService } from './firebase.service';
import { Channel } from '../models/channel.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
 

constructor(private firestore: Firestore, private authService: AuthService) {
  
}


  private userSource = new BehaviorSubject<User>(new User());
  selectedUser = this.userSource.asObservable();

  setUser(user: any) {
    this.userSource.next(user);
  }


 

}