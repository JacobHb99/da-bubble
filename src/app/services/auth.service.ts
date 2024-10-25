import { inject, Injectable, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, UserCredential,  } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { FirebaseService } from './firebase.service';
import { UserInterface } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth = inject(Auth);
  fireService = inject(FirebaseService);
  currentRegData!: { email: any; username: string; password: string, response?: UserCredential };
  currentUserSig = signal<UserInterface | null | undefined>(undefined);
  currentCredentials!: UserCredential;


  constructor() { }


  saveRegistrationData(email: any, username: string, password: string) {
    this.currentRegData = { email, username, password };
    console.log(this.currentRegData);
  }


  register(email: string, username: string, password: string, avatar: string): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    ).then(response => {
      this.handleUserData(response, email, username, password, avatar)
    })
    return from(promise);
  }


  handleUserData(response: UserCredential, email: string, username: string, password: string, avatar: string) {
    updateProfile(response.user, {
      displayName: username,
      photoURL: avatar
    });
    console.log(response.user);
    this.saveNewUserInFirestore(email, username, response.user.uid, avatar);
  }


  async saveNewUserInFirestore(email: string, username: string, uid: string, avatar: string) {
    let newUser = new User;
    newUser.avatar = avatar;
    newUser.email = email;
    newUser.username = username;
    newUser.uid = uid;
    await this.fireService.addUser(newUser);
  }


  login(email: string, password: string) {
    const promise = signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Signed in 
        this.currentCredentials = userCredential;
        console.log('loginUser', this.currentCredentials.user);
        this.setCurrentUserData();
        
        this.fireService.setUserStatus(this.currentCredentials, 'online');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
    return from(promise);
  }

  setCurrentUserData() {
    this.currentUserSig.set({
      email: this.currentCredentials.user.email!,
      username: this.currentCredentials.user.displayName!,
      uid: this.currentCredentials.user.uid!,
      avatar: this.currentCredentials.user.photoURL!,
      status: 'online',
    });
  }
}
