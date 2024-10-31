import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {  FormsModule } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';
import { User } from '../../models/user.model';


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
  searchName: string = "";
  constructor(public firebaseService: FirebaseService){}


  showInput() {
    this.isSelected = true;
  }
  hideInput() {
    this.isSelected = false;
  }

  get filteredUsers() {
    if (this.searchName.length < 3) {
      return [];
    }

    return this.firebaseService.allUsers.filter((user: any) =>
      user.username.toLowerCase().includes(this.searchName.toLowerCase())
    );
  }

  addUser(user: any) {
    if (!this.firebaseService.selectedUsers.some((u: any ) => u.username === user.username)) {
      this.firebaseService.selectedUsers.push(user);
    } 
      this.searchName = "";
    }

    removeUser(user: any) {
      this.firebaseService.selectedUsers = this.firebaseService.selectedUsers.filter((u: any) => u.username !== user.username);
    }
  }

