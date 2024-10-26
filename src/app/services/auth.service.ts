import { inject, Injectable, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile, UserCredential, UserInfo, } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { FirebaseService } from './firebase.service';
import { UserInterface } from '../interfaces/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth = inject(Auth);
  router = inject(Router);
  fireService = inject(FirebaseService);
  currentRegData!: { email: any; username: string; password: string, response?: UserCredential };
  currentUserSig = signal<UserInterface | null | undefined>(undefined);
  currentCredentials!: UserCredential;
  showAnimation: boolean = true;
  errorMessage!: string;
  errorCode!: string



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
        this.router.navigate(['/main']);
      })
      .catch((error) => {
        this.errorCode = error.code;
        this.errorMessage = error.message;
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

/**
 * Sendet eine Passwort-Zurücksetzungs-E-Mail an die angegebene E-Mail-Adresse.
 * @param email Die E-Mail-Adresse, an die die Zurücksetzungs-E-Mail gesendet werden soll.
 * @returns Eine Promise, die entweder erfolgreich ist oder einen Fehler zurückgibt.
 */
async sendPasswordReset(email: string): Promise<void> {
  const auth = getAuth();
  try {
    await sendPasswordResetEmail(auth, email);
    console.log(`Passwort-Zurücksetzungs-E-Mail wurde an ${email} gesendet.`);
  } catch (error) {
    console.error("Fehler beim Senden der Passwort-Zurücksetzungs-E-Mail:", error);
    throw error;
  }
}






}
