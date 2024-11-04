import { Component,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import {MatDialogModule} from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [MatDialogModule,CommonModule,FormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent {
  firestore = inject(Firestore);
  authService = inject(AuthService);
  firebaseService = inject(FirebaseService);
  user:any;
  

  inputName="";
  inputEmail="";
  
  constructor() {
    this.firebaseService.subscribeUserById('8a5SIplHe5Y57MeYLJHnJ81uGoV2');
    setTimeout(()=>{
      this.inputName = this.firebaseService.user.name;
      this.inputEmail = this.firebaseService.user.email;
    },1000);
  }

  ngOnInit(){
    
   
  }
  
  ngOnDestroy(){
     
  }

  changeProfil(){
    console.log(this.inputName);
  }
  
   

  
}
