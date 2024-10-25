import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, updateProfile, UserCredential } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth = inject(Auth);
  fireService = inject(FirebaseService);
  currentRegData!: { email: string; username: string; password: string, response?: UserCredential };


  constructor() { }


  saveRegistrationData(email: string, username: string, password: string) {
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
}
