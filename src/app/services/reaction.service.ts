import { Injectable, inject } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Message, Reaction } from '../models/message.model';
import { Conversation } from '../models/conversation.model';
import { AuthService } from './auth.service';
import { doc, setDoc,getDoc, Firestore, updateDoc, } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ReactionService {
  firestore = inject(Firestore);
  fiBaService = inject(FirebaseService);
  authService = inject(AuthService);

  constructor() { }

  async updateMessageWithReaction(reaction: Reaction, msgId: string, conv:Conversation) {
    const reactData = this.getCleanJSON(reaction); // Bereinigtes Reaktionsobjekt
    //const convId = conv.conId;
    const msgRef = doc(this.firestore, `conversations/${conv.conId}`);

    try {
      // 1. Dokument abrufen und Nachrichten-Array aktualisieren
      const conversationSnapshot = await getDoc(msgRef);
      const conversationData = conversationSnapshot.data();

      if (conversationData) {
        const messages = conversationData['messages'] || [];
        const messageIndex = messages.findIndex((msg: any) => msg.msgId === msgId);

        if (messageIndex >= 0) {
          const reactions = messages[messageIndex]['reactions'] || [];

          // Bestehende Reaktion aktualisieren oder neue hinzufügen
          const reactionIndex = reactions.findIndex((r: any) => r.id === reactData.id);
          if (reactionIndex >= 0) {
            reactData.counter ++;
            reactData.reactedUser.push(this.authService.currentUserSig()?.username as string)
            reactions[reactionIndex] = { ...reactions[reactionIndex], ...reactData };
          } else {
            reactions.push(reactData);
          }

          messages[messageIndex]['reactions'] = reactions;

          // Aktualisierte `messages`-Array im Dokument speichern
          await updateDoc(msgRef, { messages: messages });
          console.log('Emoji erfolgreich hinzugefügt oder aktualisiert');
        } else {
          console.error('Nachricht nicht gefunden');
        }
      } else {
        console.error('Konversation nicht gefunden');
      }
    } catch (error) {
      console.error('Fehler beim Hinzufügen des Emojis:', error);
    }
  }


  getCleanJSON(reaction: Reaction) {
    return {
      counter: reaction.counter,
      id: reaction.id,
      reactedUser: reaction.reactedUser
    }
  }

}
