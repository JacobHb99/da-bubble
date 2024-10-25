import { inject, Injectable, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, updateProfile, UserCredential, UserInfo,  } from '@angular/fire/auth';
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
  showAnimation: boolean = true;



  constructor() { }


  saveRegistrationData(email: string, username: string, password: string) {
    this.currentRegData = { email, username, password };
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
        this.setCurrentUserData(this.currentCredentials.user);
        this.fireService.setUserStatus(this.currentCredentials, 'online');
        console.log('loginUser', this.currentCredentials.user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
    return from(promise);
  }

  setCurrentUserData(user: any) {
    this.currentUserSig.set({
      email: user.email!,
      username: user.displayName!,
      uid: user.uid!,
      avatar: user.photoURL!
    });
  }


  initialize() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        this.setCurrentUserData(user);
        console.log(user);
        // ...
      } else {
        // User is signed out
        // ...
        console.log('no user');
      }
    });
  }
}
