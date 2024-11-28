import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {  FormsModule } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';
import { User } from '../../models/user.model';
import { MatDialogRef } from '@angular/material/dialog';
import { ChannelService } from '../../services/channel.service';
import { every } from 'rxjs';
import { AuthService } from '../../services/auth.service';



@Component({
  selector: 'app-add-people',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-people.component.html',
  styleUrl: './add-people.component.scss'
})
export class AddPeopleComponent {
  isHoveredClose = false;
  isSelected = false;
  isChecked = false;
  searchName: string = "";
  currentUser: any = ""
  isInputEmpty = false;
  constructor(public firebaseService: FirebaseService, public dialogRef: MatDialogRef<AddPeopleComponent>, public channelService: ChannelService, private authService: AuthService){
      this.currentUser = this.authService.currentUserSig()?.uid;
  }


  showInput() {
    this.isSelected = true;
    this.emptyInput()
  }
  hideInput() {
    this.isSelected = false;
    this.isInputEmpty = false;
    
  }


  onCheckboxChange(event: any) {
    if (event.target.checked) {
      
    } else {
      
    }
  }

  


  emptyInput() {
    this.isInputEmpty = this.firebaseService.selectedUsers.length === 0;
  }

  get filteredUsers() {
    if (this.searchName.length < 1) {
      return [];
    }

    return this.firebaseService.allUsers.filter((user: any) =>
      
      user.username.toLowerCase().includes(this.searchName.toLowerCase())
    
    );
   
    
  }

  addUser(user: any) {
    if (!this.firebaseService.selectedUsers.some((u: any ) => u.username === user.username)) {
      this.firebaseService.selectedUsers.push(user);
     this.emptyInput()
    } 
      this.searchName = "";
     this.emptyInput()
    }

    removeUser(user: any) {
      this.firebaseService.selectedUsers = this.firebaseService.selectedUsers.filter((u: any) => u.username !== user.username);
      this.emptyInput()
    }
    closeDialogAddPeople(): void {
      this.dialogRef.close(); 
    }



  }

