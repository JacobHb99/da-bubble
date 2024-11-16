import { forwardRef, Inject, inject, Injectable, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, onAuthStateChanged, sendPasswordResetEmail, signInAnonymously, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile, UserCredential, UserInfo, } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { FirebaseService } from './firebase.service';
import { UserInterface } from '../interfaces/user';
import { Router } from '@angular/router';
import { ChannelService } from './channel.service';
import { collection, DocumentData, Firestore, onSnapshot, query, QuerySnapshot, where } from '@angular/fire/firestore';
import { Channel } from '../models/channel.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth = inject(Auth);
  router = inject(Router);
  currentRegData!: { email: any; username: string; password: string, response?: UserCredential };
  currentUserSig = signal<UserInterface | null | undefined>(undefined);
  currentCredentials!: UserCredential;
  showAnimation: boolean = true;
  errorMessage: string = '';
  errorCode!: string;
  guestLoggedIn: boolean = false;


  constructor(private fireService: FirebaseService , private firestore: Firestore) {}




 
  saveRegistrationData(email: string, username: string, password: string) {
    this.currentRegData = { email, username, password };
  }

  getCurrentUserData() {
    this.fireService.getCurrentUser(this.currentUserSig()?.uid as string)
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
    // if(username === 'Gast') {
    //   avatar = '/img/avatars/avatar_default.png'
    // }
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
    newUser.channels = [];
    newUser.role = 'user'
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
        this.getCurrentUserData();
        this.router.navigate(['/main']);
      })


    return from(promise);
  }


  guestLogin() {
    const guestEmail = 'gast@mail.com';
    const guestPassword = 'gast123';
    this.guestLoggedIn = true;
    this.login(guestEmail, guestPassword);
    console.log('Gast ist eingeloggt');
  }


  // signInAnonymously() {
  //   signInAnonymously(this.auth)
  //     .then(() => {
  //       // Signed in..
  //       this.setGuestData();
  //       this.router.navigate(['/main']);
  //     })
  //     .catch((error) => {
  //       this.errorCode = error.code;
  //       this.errorMessage = error.message;
  //       // ...
  //     });
  // }


  signInWithGoogle() {
    const provider = new GoogleAuthProvider();

    signInWithPopup(this.auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        // The signed-in user info.
        if (result.user.email && result.user.displayName && result.user.photoURL) {
          this.saveNewUserInFirestore(result.user.email, result.user.displayName, result.user.uid, result.user.photoURL);
          this.setCurrentUserData(result.user);
          this.fireService.setUserStatus(result, 'online');
          this.router.navigate(['/main']);
        }
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      }).catch((error) => {
        // Handle Errors here.
        this.errorCode = error.code;
        this.errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }


  signOut() {
    const auth = getAuth();
    this.fireService.setUserStatus(this.currentCredentials, 'offline');

    signOut(this.auth).then(() => {
      this.router.navigateByUrl('');

      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
      console.log('logout fehlgeschlagen', this.currentCredentials);
      console.log('currCredentials', this.currentUserSig());
    });
  }


  setCurrentUserData(user: any) {
    this.currentUserSig.set({
      email: user.email!,
      username: user.displayName!,
      uid: user.uid!,
      avatar: user.photoURL!
    });
  }


  setGuestData() {
    this.currentUserSig.set({
      email: 'Keine email',
      username: 'Gast',
      uid: '',
      avatar: 'img/avatars/avatar_default.png'
    });
  }


  initialize() {
    const auth = getAuth();
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // User is signed in
        const uid = user.uid;
        this.setCurrentUserData(user);
        this.fireService.loadUserChannels(uid);

      } else {
        // User is signed out
        this.currentUserSig.set(null)
        console.log('user', user);
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
    try {
      await sendPasswordResetEmail(this.auth, email);
      console.log(`Passwort-Zurücksetzungs-E-Mail wurde an ${email} gesendet.`);
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 4000);
    } catch (error) {
      console.error("Fehler beim Senden der Passwort-Zurücksetzungs-E-Mail:", error);
      throw error;
    }
  }






}
