import { Injectable, inject } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Message, Reaction } from '../models/message.model';
import { Conversation } from '../models/conversation.model';
import { AuthService } from './auth.service';
import { doc, setDoc, getDoc, Firestore, updateDoc, } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ReactionService {
  firestore = inject(Firestore);
  fiBaService = inject(FirebaseService);
  authService = inject(AuthService);

  constructor() { }

  // async updateMessageWithReaction(reaction: Reaction, msgId: string, conv: Conversation) {
  //   const reactData = this.getCleanJSON(reaction); // Bereinigtes Reaktionsobjekt
  //   //const convId = conv.conId;
  //   const msgRef = doc(this.firestore, `conversations/${conv.conId}`);

  //   try {
  //     // 1. Dokument abrufen und Nachrichten-Array aktualisieren
  //     const conversationSnapshot = await getDoc(msgRef);
  //     const conversationData = conversationSnapshot.data();

  //     if (conversationData) {
  //       const messages = conversationData['messages'] || [];
  //       const messageIndex = messages.findIndex((msg: any) => msg.msgId === msgId);

  //       if (messageIndex >= 0) {
  //         const reactions = messages[messageIndex]['reactions'] || [];

  //         // Bestehende Reaktion aktualisieren oder neue hinzufügen
  //         const reactionIndex = reactions.findIndex((r: any) => r.id === reactData.id);
  //         if (reactionIndex >= 0) {
  //           console.log('reactData', reactData)
  //           reactData.counter++;
  //           let dataArray = this.convertObjToArray(reactData.reactedUser)
  //           let currentUser = this.authService.currentUserSig()?.username as string
  //           if (this.doubleReact(dataArray, currentUser)) {

  //           }

  //           console.log('dataArray', dataArray)
  //           dataArray.push([this.authService.currentUserSig()?.username as string, true])
  //           console.log('dataArray', dataArray)
  //           reactData.reactedUser = this.convertArrayToObject(dataArray)

  //           //reactions[reactionIndex] = { ...reactions[reactionIndex], ...reactData };
  //           reactions[reactionIndex] = {
  //             ...reactions[reactionIndex],
  //             //counter: reactions[reactionIndex].counter + 1,
  //             reactedUser: Array.from(new Set([...reactions[reactionIndex].reactedUser, reaction.reactedUser]))
  //           };
  //         } else {
  //           reactions.push(reactData);
  //         }

  //         messages[messageIndex]['reactions'] = reactions;

  //         // Aktualisierte `messages`-Array im Dokument speichern
  //         await updateDoc(msgRef, { messages: messages });
  //         console.log('Emoji erfolgreich hinzugefügt oder aktualisiert');
  //       } else {
  //         console.error('Nachricht nicht gefunden');
  //       }
  //     } else {
  //       console.error('Konversation nicht gefunden');
  //     }
  //   } catch (error) {
  //     console.error('Fehler beim Hinzufügen des Emojis:', error);
  //   }
  // }

  // doubleReact(dataArray:[string, any], currentUser: string) {
  //   reactedUserArray = dataArray.filter(
  //     ([username, value]) => username !== currentUser
  // );
  // }

  // convertObjToArray(reactedUser: object) {
  //   let objectToArray = Object.entries(reactedUser);
  //   return objectToArray
  // }

  // convertArrayToObject(dataArray: any) {
  //   let updatedReactedUser = Object.fromEntries(dataArray);
  //   return updatedReactedUser
  // }

  async updateMessageWithReaction(reaction: Reaction, msgId: string, conv: Conversation) {
    const reactData = this.getCleanJSON(reaction); // Bereinigtes Reaktionsobjekt
    const msgRef = doc(this.firestore, `conversations/${conv.conId}`);
    console.log(`Updating document at path: conversations/${conv.conId}`);
    try {
      // 1. Dokument abrufen und Nachrichten-Array aktualisieren
      const conversationSnapshot = await getDoc(msgRef);
      const conversationData = conversationSnapshot.data();

      if (conversationData) {
        const messages = conversationData['messages'] || [];
        const messageIndex = messages.findIndex((msg: any) => msg.msgId === msgId);

        if (messageIndex >= 0) {
          // Reaktionen als Objektstruktur
          const reactions = messages[messageIndex]['reactions'] || [];
          const reactionIndex = reactions.findIndex((r: any) => r.id === reactData.id);
          if (reactionIndex >= 0) {
            let loggedInUser = this.authService.currentUserSig()?.username as string
            const doubleUser = reactData.reactedUser.map((username, index) =>
              username === loggedInUser ? index : -1).filter(index => index !== -1);

            if (doubleUser.length > 1) {
              console.log('DOUBLE-USER')
              reactData.reactedUser.splice(doubleUser[0], 1);
              reactions[reactionIndex] = { ...reactions[reactionIndex], ...reactData };
            } else {
              //reactData.counter++;
              //reactData.reactedUser.push(this.authService.currentUserSig()?.username as string)
              //reactions[reactionIndex] = { ...reactions[reactionIndex], ...reactData };
            }



            //reactions[reactionIndex] = { ...reactions[reactionIndex], ...reactData };
          } else {
            // Neue Reaktion hinzufügen
            reactions.push(reactData);
          }

          // Aktualisierte Reaktionen zurück in die Nachricht setzen
          messages[messageIndex]['reactions'] = reactions;
          console.log('Saving messages to Firestore:', messages);

          // Aktualisierte messages-Array im Dokument speichern
          try {
            await updateDoc(msgRef, { messages });
            console.log('Update successful.');
          } catch (error) {
            console.error('Error while updating Firestore:', error);
          }
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

  checkDoublereact(reactData: Reaction) {
    let reactedUser = reactData.reactedUser
    let loggedInUser = this.authService.currentUserSig()?.username as string
    const user = reactedUser.map((user: any) => user.username === loggedInUser)
    return user
  }

  getCleanJSON(reaction: Reaction) {
    return {
      counter: reaction.counter,
      id: reaction.id,
      reactedUser: reaction.reactedUser
    }
  }

}
