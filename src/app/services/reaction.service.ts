import { Injectable, inject } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Message, Reaction } from '../models/message.model';
import { Conversation } from '../models/conversation.model';
import { AuthService } from './auth.service';
import { doc, setDoc, getDoc, Firestore, updateDoc, arrayUnion } from '@angular/fire/firestore';
import { ConversationService } from './conversation.service';

@Injectable({
  providedIn: 'root'
})
export class ReactionService {
  firestore = inject(Firestore);
  fiBaService = inject(FirebaseService);
  authService = inject(AuthService);
  conService = inject(ConversationService);

  convNeedet: 'data' | 'ref' = 'ref';

  constructor() { }

  // async updateMessageWithReaction(currentReaction: Reaction, msgId: string, conv: Conversation) {
  //   const reactionId: string = currentReaction.id;
  //   const username: string = this.authService.currentUserSig()?.username as string;
  //   const convRef = doc(this.firestore, `conversations/${conv.conId}`);
  //   const conversationSnapshot = await getDoc(convRef);

  //   if (!conversationSnapshot.exists()) {
  //     console.error("Conversation not found");
  //     return;
  //   }

  //   // Lade die vorhandenen Nachrichten
  //   const conversationData = conversationSnapshot.data();
  //   const messages = conversationData['messages'];

  //   // Nachricht anhand msgId finden
  //   const messageIndex = messages.findIndex((msg: any) => msg.msgId === msgId);
  //   if (messageIndex === -1) {
  //     console.error("Message not found");
  //     return;
  //   }

  //   const message = messages[messageIndex];

  //   // Reaktion anhand reactionId finden
  //   let reactionIndex = message.reactions.findIndex((reaction: any) => reaction.id === reactionId);

  //   let reaction;
  //   if (reactionIndex === -1) {
  //     // Falls keine Reaktion mit dieser ID existiert, erstelle eine neue

  //     reaction = {
  //       id: reactionId,
  //       reactedUser: { [username]: true },
  //       counter: 1,
  //     };
  //     message.reactions.push(reaction);
  //   } else {
  //    let reactionRef = message.reactions[reactionIndex];

  //     // Überprüfen, ob Benutzer bereits reagiert hat, und entsprechend hinzufügen/entfernen
  //     if (reactionRef.reactedUser[username]) {
  //       // Benutzer entfernen
  //       delete reactionRef.reactedUser[username];
  //       reactionRef.counter = Object.keys(reactionRef.reactedUser).length;

  //       // Falls keine Benutzer mehr übrig sind, entferne die Reaktion
  //       if (reactionRef.counter === 0) {
  //         message.reactions.splice(reactionIndex, 1);
  //       }
  //     } else {
  //       // Benutzer hinzufügen
  //       reactionRef.reactedUser[username] = true;
  //       reactionRef.counter = Object.keys(reactionRef.reactedUser).length;
  //     }

  //     // Aktualisiere die Reaktion im Array
  //     if (reactionRef.counter > 0) {
  //       message.reactions[reactionIndex] = reaction;
  //     }
  //   }

  //   // Nachricht im messages-Array aktualisieren
  //   messages[messageIndex] = message;

  //   // Aktualisiertes messages-Array in Firestore speichern
  //   await updateDoc(convRef, { messages });
  //   console.log("Reaction updated successfully");
  // }


  async getConvData(convNeedet: 'data' | 'ref') {
    const conv = this.fiBaService.currentConversation;
    const convRef = doc(this.firestore, `conversations/${conv.conId}`);
    if (convNeedet === 'ref') {
      return convRef
    } else {
      const conversationSnapshot = await getDoc(convRef);
      if (!conversationSnapshot.exists()) {
        console.error("Conversation not found");
        return;
      }

      const conversationData = conversationSnapshot.data();
      return conversationData
    }
  }

  async deleteEmoji(currentMessage: Message) {
    const conversationData: any = await this.getConvData('data')
    const username = this.authService.currentUserSig()?.username as string;
    const msgId = currentMessage.msgId

    const messages = conversationData['messages'];
    
    const messageIndex = this.findMessageIndex(messages, msgId);
    if (messageIndex === -1) {
      console.error("Message not found");
      return;
    }

    const message = messages[messageIndex];

    const oldReactionIndex = this.findUserReactionIndex(message.reactions, username);

    if (oldReactionIndex !== -1) {
      this.removeUserFromReaction(message.reactions[oldReactionIndex], username);

      if (message.reactions[oldReactionIndex].counter === 0) {
        this.removeReactionFromMessage(message, oldReactionIndex);
      }
    } this.updateMessageInFirestore(await this.getConvData('ref'), messages);
  }


  async updateMessageWithReaction(emoji: any, currentMessage: Message) {
    const conversationData: any = await this.getConvData('data')
    let newReaction = this.createNewReaction(emoji)
    const username = this.authService.currentUserSig()?.username as string;
    //const conv = this.fiBaService.currentConversation;
    const msgId = currentMessage.msgId

    // const convRef = doc(this.firestore, `conversations/${conv.conId}`);
    // const conversationSnapshot = await getDoc(convRef);

    // if (!conversationSnapshot.exists()) {
    //   console.error("Conversation not found");
    //   return;
    // }

    // const conversationData = conversationSnapshot.data();
    const messages = conversationData['messages'];
    console.log('conversationData', conversationData)
    // Nachricht finden
    const messageIndex = this.findMessageIndex(messages, msgId);
    if (messageIndex === -1) {
      console.error("Message not found");
      return;
    }

    const message = messages[messageIndex];

    // Prüfen, ob Benutzer bereits eine Reaktion gegeben hat
    const oldReactionIndex = this.findUserReactionIndex(message.reactions, username);

    if (oldReactionIndex !== -1) {
      // Benutzer hat bereits reagiert -> Alte Reaktion entfernen
      this.removeUserFromReaction(message.reactions[oldReactionIndex], username);

      // Wenn alte Reaktion keine Nutzer mehr hat, Reaktion entfernen
      if (message.reactions[oldReactionIndex].counter === 0) {
        this.removeReactionFromMessage(message, oldReactionIndex);
      }
    }

    // Neue Reaktion hinzufügen oder aktualisieren
    const newReactionIndex = this.findReactionIndex(message.reactions, newReaction.id);

    if (newReactionIndex !== -1) {
      // Reaktion existiert -> Benutzer hinzufügen
      this.addUserToReaction(message.reactions[newReactionIndex], username);
    } else {
      // Neue Reaktion erstellen und hinzufügen
      this.addNewReactionToMessage(message, newReaction, username);
    }

    // Aktualisierte Nachricht speichern
    //this.updateMessageInFirestore(convRef, messages);
    this.updateMessageInFirestore(await this.getConvData('ref'), messages);
  }



  findMessageIndex(messages: any[], msgId: string): number {
    return messages.findIndex((msg: any) => msg.msgId === msgId);
  }

  findUserReactionIndex(reactions: Reaction[], username: string): number {
    return reactions.findIndex((reaction: Reaction) => reaction.reactedUser[username]);
  }

  findReactionIndex(reactions: Reaction[], reactionId: string): number {
    return reactions.findIndex((reaction: Reaction) => reaction.id === reactionId);
  }

  removeUserFromReaction(reaction: Reaction, username: string) {
    delete reaction.reactedUser[username];
    reaction.counter = Object.keys(reaction.reactedUser).length;
  }

  removeReactionFromMessage(message: any, reactionIndex: number) {
    message.reactions.splice(reactionIndex, 1);
  }

  addUserToReaction(reaction: Reaction, username: string) {
    reaction.reactedUser[username] = true;
    reaction.counter = Object.keys(reaction.reactedUser).length;
  }

  addNewReactionToMessage(message: any, newReaction: Reaction, username: string) {
    const reactionToAdd = {
      id: newReaction.id,
      reactedUser: { [username]: true },
      counter: 1
    };
    message.reactions.push(reactionToAdd);
  }

  async updateMessageInFirestore(convRef: any, messages: any[]) {
    try {
      await updateDoc(convRef, { messages });
      console.log("Messages successfully updated in Firestore");
    } catch (error) {
      console.error("Error updating messages in Firestore:", error);
    }
  }

  createNewReaction(emoji: any) {
    const username = this.authService.currentUserSig()?.username as string;

    return new Reaction({
      counter: 1,
      id: emoji.id,
      reactedUser: {
        [`${username}`]: true
      }
    });
  }








  // createNewReaction(id: any) {
  //   const username = this.authService.currentUserSig()?.username as string;

  //   return new Reaction({
  //     counter: 1,
  //     id: id,
  //     reactedUser: {
  //       [`${username}`]: true
  //     }
  //   });
  // }

  // addUserToArray(reaction: Reaction, username: string) {
  //   console.log('AddUserToreaction',reaction)
  //   if (!reaction.reactedUser.includes(username)) {
  //     console.log('ADDUSER9561651')
  //     reaction.reactedUser.push(username);
  //     reaction.counter = reaction.reactedUser.length +1;
  //     console.log('UpdatedReaction',reaction)
  //   }
  //   // if (!this.reactedUser.includes(username)) {
  //   //   this.reactedUser.push(username);
  //   //   this.counter = this.reactedUser.length;
  //   // }
  // }

  // removeUserFromArray(reaction: Reaction, username: string) {
  //   const filteredUser = reaction.reactedUser.filter(user => user !== username);
  //   reaction.counter = filteredUser.length-1;
  //   // this.reactedUser = this.reactedUser.filter(user => user !== username);
  //   // this.counter = this.reactedUser.length;
  // }

  // getCleanJSON(reaction: Reaction) {
  //   return {
  //     counter: reaction.counter,
  //     id: reaction.id,
  //     reactedUser: reaction.reactedUser
  //   }
  // }


}
