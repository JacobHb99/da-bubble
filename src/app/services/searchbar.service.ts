import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Channel } from '../models/channel.model';
import { Conversation } from '../models/conversation.model';
import { FirebaseService } from './firebase.service';
import { user } from '@angular/fire/auth';
import { AuthService } from './auth.service';
import { Thread } from '../models/thread.model';
type CurrentObject =
  | { name: "user"; data: User }
  | { name: "channel"; data: Channel }
  | { name: "conversation"; data: Conversation }
  | { name: "channel-chat"; channelId: string; data: Channel }
  | { name: "thread"; data: Thread }

@Injectable({
  providedIn: 'root'
})

export class SearchbarService {
  searchName: string = "";
  newMsgSearchName: string = "";
  filteredResults: any[] = []; // Gefilterte Ergebnisse für neue
  isInputEmpty: boolean = false;
  allObjects: CurrentObject[] = [];

  constructor(private firebaseService: FirebaseService, private authService: AuthService) { }

  /**
   * Kombiniert Arrays von Firebase-Objekten in ein Array von Objekten mit Typen und Daten.
   * Jedes Objekt enthält einen Typ (z.B. "user", "channel", "conversation") und die dazugehörigen Daten.
   * 
   * Die Arrays von `allUsers`, `allChannels`, `allConversations`, und `allThreads` werden durchlaufen und jedes Element wird in ein neues Objekt mit Typ und Daten umgewandelt.
   */
  combineArraysWithTypes() {
    this.allObjects = [];

    // Umwandeln der Arrays und Pushen in das neue Array
    this.firebaseService.allUsers.forEach(user => {
      this.allObjects.push({ name: "user", data: user });
    });

    this.firebaseService.allChannels.forEach(channel => {
      this.allObjects.push({ name: "channel", data: channel });
      this.allObjects.push({ name: "channel-chat", channelId: channel.chaId, data: channel });
    });

    this.firebaseService.allConversations.forEach(conversation => {
      if (conversation.creatorId == (this.authService.currentUserSig()?.uid) || conversation.partnerId == (this.authService.currentUserSig()?.uid)) {
        this.allObjects.push({ name: "conversation", data: conversation });
      }
    });

    this.firebaseService.allThreads.forEach(thread => {
      this.allObjects.push({ name: "thread", data: thread });
    });
    console.log(this.allObjects);
  }


  /**
   * Überprüft, ob der ausgewählte Benutzer-Input leer ist, und setzt die Sichtbarkeit der Eingabemaske auf `true`, wenn keine Benutzer ausgewählt sind.
   * Setzt außerdem den `searchName` auf eine leere Zeichenkette.
   */
  emptyInput() {
    this.isInputEmpty = this.firebaseService.selectedUsers.length === 0;
    this.searchName = "";
  }

  /**
   * Setzt den `newMsgSearchName` auf eine leere Zeichenkette und leert die `filteredResults`.
   */
  emptyMsgInput() {
    this.newMsgSearchName = "";
    this.filteredResults = [];
  }

  /**
   * Filtert die Benutzer und Kanäle basierend auf dem `searchName`. 
   * Die Filterung erfolgt abhängig vom Namen (Benutzername für Benutzer, Titel/Beschreibung für Kanäle, Nachrichteninhalt für Konversationen und Threads).
   * 
   * @returns {Array} - Ein Array mit den gefilterten Objekten basierend auf dem Suchkriterium.
   */
  get filteredUsers() {
    if (this.searchName.trim().length < 1) {

      return [];
    }

    const searchTerm = this.searchName.toLowerCase();
    const results = this.allObjects.filter((obj: CurrentObject) => {


      if (obj.name === "user") {
        return obj.data.username.toLowerCase().includes(searchTerm);

      }

      if (obj.name === "channel") {
        return (
          obj.data.title.toLowerCase().includes(searchTerm) ||
          obj.data.description.toLowerCase().includes(searchTerm)
        );
      }

      if (obj.name === "conversation") {
        console.log(obj.data.messages);

        return obj.data.messages.some((message: any) =>
          message.text.toLowerCase().includes(searchTerm)
        );
      }

      if (obj.name === "channel-chat") {
        console.log(obj.data.messages);

        return obj.data.messages.some((message: any) =>
          message.text.toLowerCase().includes(searchTerm)
        );
      }

      if (obj.name === "thread") {
        console.log(obj.data.messages);

        return obj.data.messages.some((message: any) =>
          message.text.toLowerCase().includes(searchTerm)
        );
      }

      return false;
    });

    console.log("Filtered Results:", results);
    return results;
  }

  /**
   * Sucht nach Benutzern und Kanälen basierend auf der Eingabe im `newMsgSearchName`.
   * Es werden Benutzer mit einem `@` und Kanäle mit einem `#` vor dem Suchbegriff gefiltert.
   * Wenn keine speziellen Zeichen vorhanden sind, wird nach E-Mails gefiltert.
   * 
   * Der `filteredResults` Array wird basierend auf dem Suchbegriff aktualisiert.
   */
  newMsgSearch() {
    if (this.newMsgSearchName.startsWith('@')) {
      // Filter Benutzer bei '@'
      const searchTerm = this.newMsgSearchName.slice(1).toLowerCase();
      this.filteredResults = this.firebaseService.allUsers.filter(user =>
        user.username.toLowerCase().includes(searchTerm)
      );
    } else if (this.newMsgSearchName.startsWith('#')) {
      // Filter Channels bei '#'
      const searchTerm = this.newMsgSearchName.slice(1).toLowerCase();
      this.filteredResults = this.firebaseService.allChannels.filter(channel =>
        channel.title.toLowerCase().includes(searchTerm)
      );
    } else if (this.newMsgSearchName) {
      this.filteredResults = this.firebaseService.allUsers.filter(user =>
        user.email.toLowerCase().includes(this.newMsgSearchName)
      );
    } else {
      // Keine Filterbedingung, leer
      this.filteredResults = [];
    }
  }

  ngOnDestroy(){
    
  }
}
