import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [MatDialogModule, CommonModule, FormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss',
})
export class EditProfileComponent {
  authService = inject(AuthService);
  firebaseService = inject(FirebaseService);
  user: any;

  inputName = '';
  inputEmail = '';

  constructor(public dialogRef: MatDialogRef<EditProfileComponent>) {
    let userId = this.authService.currentUserSig()?.uid;
    this.firebaseService.subscribeUserById(userId);

    setTimeout(() => {
      this.inputName = this.firebaseService.user.username;
      this.inputEmail = this.firebaseService.user.email;
      this.setUser();
    }, 100);
  }

  changeProfil() {
      this.user.username =this.inputName;
      this.user.email= this.inputEmail;
      this.firebaseService.updateUser(this.user);
      this.dialogRef.close();
  }

  setUser(): any {
    this.user = {
      uid: this.firebaseService.user.uid,
      username: this.firebaseService.user.username,
      email: this.firebaseService.user.email,
      avatar: this.firebaseService.user.avatar,
      status: this.firebaseService.user.status,
      channels: this.firebaseService.user.channels,
      role: this.firebaseService.user.role,
    };
  }
}
