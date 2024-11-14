import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';
import { arrayUnion, doc, DocumentData, Firestore, updateDoc, writeBatch } from '@angular/fire/firestore';
import { FirebaseService } from './firebase.service';
import { Channel } from '../models/channel.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserDataService {
  userObject!: DocumentData;

constructor(private firestore: Firestore, private authService: AuthService) {
  
}


  private userSource = new BehaviorSubject<User>(new User());
  selectedUser = this.userSource.asObservable();

  setUser(user: any) {
    this.userSource.next(user);
  }


  checkCurrentId(user: any) {
      if (user['uid'] == this.authService.currentUserSig()?.uid) {
         this.userObject = user;
         console.log(this.userObject);
        }
  }

  async addChannelWithMembers(newChannel: Channel) {
    try {
        // Channel-Dokument in der 'channels'-Collection aktualisieren
        const channelRef = doc(this.firestore, "channels", newChannel.chaId);

        // Fügen Sie den Channel mit allen Mitgliedern hinzu
        await updateDoc(channelRef, {
            users: newChannel.users, // Alle Mitglieder des Channels
        });

        // Benutzer in der 'users'-Collection aktualisieren
        const batch = writeBatch(this.firestore); // Batch für effizientere Updates

        newChannel.users.forEach(user => {
            const userRef = doc(this.firestore, "users", user.uid as string);
            batch.update(userRef, {
                channels: arrayUnion(newChannel.getJSON()) // Channel-ID zu jedem Benutzer hinzufügen
            });
        });

        // Batch ausführen
        await batch.commit();

        console.log("Channel erfolgreich mit Mitgliedern aktualisiert und den Benutzern hinzugefügt.");
    } catch (error) {
        console.error("Fehler beim Hinzufügen des Channels mit Mitgliedern:", error);
    }
}
}



