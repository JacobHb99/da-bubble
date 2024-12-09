import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { arrayUnion, doc, DocumentData, Firestore, updateDoc, writeBatch } from '@angular/fire/firestore';
import { FirebaseService } from './firebase.service';
import { Channel } from '../models/channel.model';
import { AuthService } from './auth.service';
import { UserInterface } from '../interfaces/user';
import { UserCredential } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  currentUserSig = signal<UserInterface | null | undefined>(undefined);
  currentCredentials: UserCredential;



  constructor(private authService: AuthService, private firebaseService: FirebaseService) {
    this.currentUserSig = this.authService.currentUserSig;
    this.currentCredentials = this.authService.currentCredentials;
  }

  /**
   * Setzt den aktuellen Benutzer im BehaviorSubject.
   * @param {UserInterface | null | undefined} user - Das Benutzerobjekt, das gesetzt werden soll.
   */
  setCurrentUser(user: UserInterface | null | undefined) {
    this.currentUserSig.set(user);
  }

  /**
   * Gibt den aktuellen Benutzer zurück.
   * @returns {UserInterface | null | undefined} - Das aktuelle Benutzerobjekt oder `undefined`, wenn kein Benutzer gesetzt ist.
   */
  getCurrentUser() {
    return this.currentUserSig();
  }


  private userSource = new BehaviorSubject<User>(new User());
  selectedUser = this.userSource.asObservable();

  /**
   * Setzt einen neuen Benutzer im BehaviorSubject.
   * @param {any} user - Das Benutzerobjekt, das gesetzt werden soll.
   */
  setUser(user: any) {
    this.userSource.next(user);
  }
}