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

    let newReaction = this.createNewReaction(emoji)
    const username = this.authService.currentUserSig()?.username as string;
    const msgId = currentMessage.msgId;
    const conversationData: any = await this.getConvData('data')
    const messages = conversationData['messages'];
    //console.log('conversationData', conversationData)

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
}
