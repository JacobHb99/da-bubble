import { Injectable, inject } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Message, Reaction } from '../models/message.model';
import { Conversation } from '../models/conversation.model';
import { AuthService } from './auth.service';
import { doc, setDoc, getDoc, Firestore, updateDoc, arrayUnion } from '@angular/fire/firestore';
import { ConversationService } from './conversation.service';
import { ChannelService } from './channel.service';
import { InterfaceService } from './interface.service';
import { StorageInstances } from '@angular/fire/storage';
import { DocumentData } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ReactionService {
  firestore = inject(Firestore);
  fiBaService = inject(FirebaseService);
  authService = inject(AuthService);
  conService = inject(ConversationService);
  channelService = inject(ChannelService);
  interfaceService = inject(InterfaceService);

  constructor() { }

  async updateMessageWithReaction(emoji: any, currentMessage: Message) {
    let newReaction = this.createNewReaction(emoji)
    const username = this.authService.currentUserSig()?.username as string;
    const msgId = currentMessage.msgId;
    const ref = await this.searchMsgById(msgId);
    if (!ref) {
      console.error('Reference path not found for the given message.');
      return;
    }
    const conversationData = await this.getDataFromRef(ref)

    if (conversationData) {
      const message = this.findMessageData(conversationData, msgId);
      const messages = conversationData['messages'];
      this.handleReaction(message, newReaction, username);

      // Aktualisierte Nachricht speichern
      const dataRef = doc(this.firestore, ref)
      this.updateMessageInFirestore(dataRef, messages);
    } else {
      console.error("conversationData not found");
    }
  }

  async searchMsgById(msgId: string) {
    const allSources = [
      { data: this.fiBaService.allConversations, key: 'conId', basePath: 'conversations' },
      { data: this.fiBaService.allChannels, key: 'chaId', basePath: 'channels' },
      { data: this.fiBaService.allThreads, key: 'id', basePath: 'threads' },
    ];

    for (const source of allSources) {
      console.log('Prüfe Quelle:', source.basePath);

      const message = source.data
        .flatMap((conv) => conv.messages)
        .find((message) => message.msgId === msgId);

      if (message) {
        // Dynamischer refPath basierend auf dem Schlüssel und Basispfad
        const refId = (source.data.find((conv) =>
          conv.messages.some((msg) => msg.msgId === msgId)
        ) as any)?.[source.key];

        if (refId) {
          const refPath = `${source.basePath}/${refId}`;
          console.log('Gefundene Referenz:', refPath);
          if (refPath) {
            return refPath;
          }
        }
      }
    } return null;
  }

  findMessageData(conversationData: DocumentData, msgId: string) {
    const messages = conversationData['messages'];
    const messageIndex = this.findMessageIndex(messages, msgId);
    if (messageIndex === -1) {
      console.error("Message not found");
      return;
    }
    const message = messages[messageIndex];
    if (message) {
      return message
    }
  }

  handleReaction(message: any, newReaction: Reaction, username: string) {    
    this.removeReactionAndUserFromMessage(message, username);

    // Neue Reaktion hinzufügen oder aktualisieren
    const newReactionIndex = this.findReactionIndex(message.reactions, newReaction.id);

    if (newReactionIndex !== -1) {
      // Reaktion existiert -> Benutzer hinzufügen
      this.addUserToReaction(message.reactions[newReactionIndex], username);
    } else {
      // Neue Reaktion erstellen und hinzufügen
      this.addNewReactionToMessage(message, newReaction, username);
    }
  }



  removeReactionAndUserFromMessage(message: any, username: string) {
    const oldReactionIndex = this.findUserReactionIndex(message.reactions, username);

    if (oldReactionIndex !== -1) {
      this.removeUserFromReaction(message.reactions[oldReactionIndex], username);

      if (message.reactions[oldReactionIndex].counter === 0) {
        this.removeReactionFromMessage(message, oldReactionIndex);
      }
    }
  }

  async deleteEmoji(currentMessage: Message) {
    const username = this.authService.currentUserSig()?.username as string;
    const msgId = currentMessage.msgId
    const ref = await this.searchMsgById(msgId);

    if (!ref) {
      console.error('Reference path not found for the given message.');
      return;
    }
    const conversationData = await this.getDataFromRef(ref)
    if (conversationData) {
      const message = this.findMessageData(conversationData, msgId);
      const messages = conversationData['messages'];
      this.removeReactionAndUserFromMessage(message, username);
      const dataRef = doc(this.firestore, ref)
      this.updateMessageInFirestore(dataRef, messages);
    }
  }

  







 


  async getDataFromRef(ref: string) {
    const dataRef = doc(this.firestore, ref);
    const dataSnapshot = await getDoc(dataRef)
    const data = dataSnapshot.data();
    return data
  }



  async updateMessageInFirestore(ref: any, messages: any[]) {
    try {
      await updateDoc(ref, { messages });
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
      },
    });
  }

    addNewReactionToMessage(message: Message, newReaction: Reaction, username: string) {
    const reactionToAdd = {
      id: newReaction.id,
      reactedUser: { [username]: true },
      counter: 1
    };
    message.reactions.push(reactionToAdd);
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


}
