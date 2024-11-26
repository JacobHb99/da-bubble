import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { arrayUnion, doc, DocumentData, Firestore, updateDoc, writeBatch } from '@angular/fire/firestore';
import { FirebaseService } from './firebase.service';
import { Channel } from '../models/channel.model';
import { AuthService } from './auth.service';
import { UserInterface } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  currentUserSig = signal<UserInterface | null | undefined>(undefined);


constructor(private authService: AuthService, private firebaseService: FirebaseService) {
  this.currentUserSig = this.authService.currentUserSig;
}


setCurrentUser(user: UserInterface | null | undefined) {
  this.currentUserSig.set(user);
}

getCurrentUser() {
  return this.currentUserSig();
}


  private userSource = new BehaviorSubject<User>(new User());
  selectedUser = this.userSource.asObservable();

  setUser(user: any) {
    this.userSource.next(user);
  }




}