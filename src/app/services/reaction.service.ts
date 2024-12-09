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

  /**
   * Aktualisiert eine Nachricht mit einem Emoji-Reaktionsobjekt.
   * 
   * @param {any} emoji - Das Emoji, das als Reaktion hinzugefügt werden soll.
   * @param {Message} currentMessage - Die Nachricht, die aktualisiert werden soll.
   * 
   * Diese Methode erstellt eine neue Reaktion basierend auf dem gegebenen Emoji und sucht nach der Nachricht in den verschiedenen Quellen (Konversationen, Kanälen, Threads). Wenn die Nachricht gefunden wird, wird die Reaktion auf die Nachricht angewendet und die aktualisierte Nachricht wird in Firestore gespeichert.
   */
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

  /**
   * Gibt den Dokumenten-Referenzpfad zurück, basierend auf dem gegebenen `ref`.
   * 
   * @param {string} ref - Der Pfad des Dokument-Referenzs in Firestore.
   * 
   * @returns {DocumentReference} - Die Firestore-Dokument-Referenz.
   */
  getDocRef(ref: string) {
    const dataRef = doc(this.firestore, ref)
    return dataRef
  }

  /**
   * Sucht nach einer Nachricht basierend auf ihrer ID in verschiedenen Quellen (Konversationen, Kanälen, Threads).
   * 
   * @param {string} msgId - Die ID der Nachricht, nach der gesucht werden soll.
   * 
   * @returns {Promise<string | null>} - Der Dokumentenpfad, falls gefunden, sonst `null`.
   */
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

  /**
   * Sucht nach der Nachricht in den übergebenen Daten.
   * 
   * @param {DocumentData} conversationData - Die Daten der Konversation, die Nachrichten enthalten.
   * @param {string} msgId - Die ID der Nachricht.
   * 
   * @returns {any} - Die gefundene Nachricht oder `undefined`, falls nicht gefunden.
   */
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

  /**
   * Verarbeitet die Reaktion auf eine Nachricht.
   * 
   * @param {any} message - Die Nachricht, die die Reaktion erhält.
   * @param {Reaction} newReaction - Das neue Emoji-Reaktionsobjekt.
   * @param {string} username - Der Benutzername des aktuellen Benutzers, der die Reaktion hinterlässt.
   */
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

  /**
   * Entfernt eine Reaktion und den Benutzer von einer Nachricht.
   * 
   * @param {any} message - Die Nachricht, bei der die Reaktion entfernt werden soll.
   * @param {string} username - Der Benutzername des aktuellen Benutzers, dessen Reaktion entfernt werden soll.
   */
  removeReactionAndUserFromMessage(message: any, username: string) {
    const oldReactionIndex = this.findUserReactionIndex(message.reactions, username);

    if (oldReactionIndex !== -1) {
      this.removeUserFromReaction(message.reactions[oldReactionIndex], username);

      if (message.reactions[oldReactionIndex].counter === 0) {
        this.removeReactionFromMessage(message, oldReactionIndex);
      }
    }
  }

  /**
   * Löscht ein Emoji-Reaktionsobjekt von einer Nachricht.
   * 
   * @param {Message} currentMessage - Die Nachricht, bei der das Emoji gelöscht werden soll.
   */
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

  /**
   * Holt die Daten aus der Firestore-Dokument-Referenz.
   * 
   * @param {string} ref - Der Firestore-Dokumentenpfad.
   * 
   * @returns {Promise<DocumentData | undefined>} - Die Dokumentendaten oder `undefined`, falls Dokument nicht gefunden.
   */
  async getDataFromRef(ref: string) {
    const dataRef = doc(this.firestore, ref);
    const dataSnapshot = await getDoc(dataRef)
    const data = dataSnapshot.data();
    return data
  }

  /**
   * Aktualisiert eine Nachricht in Firestore.
   * 
   * @param {any} ref - Der Firestore-Dokumenten-Referenz.
   * @param {any[]} messages - Die aktualisierten Nachrichten.
   */
  async updateMessageInFirestore(ref: any, messages: any[]) {
    try {
      await updateDoc(ref, { messages });
      console.log("Messages successfully updated in Firestore");
    } catch (error) {
      console.error("Error updating messages in Firestore:", error);
    }
  }

  /**
   * Erzeugt ein neues Emoji-Reaktionsobjekt.
   * 
   * @param {any} emoji - Das Emoji für die Reaktion.
   * 
   * @returns {Reaction} - Das erstellte Emoji-Reaktionsobjekt.
   */
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

  /**
   * Fügt eine neue Reaktion zu einer Nachricht hinzu.
   * 
   * @param {Message} message - Die Nachricht, zu der die Reaktion hinzugefügt werden soll.
   * @param {Reaction} newReaction - Das neue Emoji-Reaktionsobjekt.
   * @param {string} username - Der Benutzername des aktuellen Benutzers.
   */
  addNewReactionToMessage(message: Message, newReaction: Reaction, username: string) {
    const reactionToAdd = {
      id: newReaction.id,
      reactedUser: { [username]: true },
      counter: 1
    };
    message.reactions.push(reactionToAdd);
  }

  /**
   * Sucht nach der Indexposition einer Nachricht in einem Array von Nachrichten.
   * 
   * @param {any[]} messages - Das Array von Nachrichten.
   * @param {string} msgId - Die ID der Nachricht.
   * 
   * @returns {number} - Die Indexposition der Nachricht oder `-1`, falls nicht gefunden.
   */
  findMessageIndex(messages: any[], msgId: string): number {
    return messages.findIndex((msg: any) => msg.msgId === msgId);
  }

  /**
   * Sucht nach der Indexposition einer Reaktion eines Benutzers in einem Array von Reaktionen.
   * 
   * @param {Reaction[]} reactions - Das Array von Reaktionen.
   * @param {string} username - Der Benutzername des aktuellen Benutzers.
   * 
   * @returns {number} - Die Indexposition der Reaktion oder `-1`, falls nicht gefunden.
   */
  findUserReactionIndex(reactions: Reaction[], username: string): number {
    return reactions.findIndex((reaction: Reaction) => reaction.reactedUser[username]);
  }

  /**
   * Sucht nach der Indexposition einer bestimmten Reaktion im Array der Reaktionen einer Nachricht.
   * 
   * @param {Reaction[]} reactions - Das Array von Reaktionen.
   * @param {string} reactionId - Die ID der Reaktion.
   * 
   * @returns {number} - Die Indexposition der Reaktion oder `-1`, falls nicht gefunden.
   */
  findReactionIndex(reactions: Reaction[], reactionId: string): number {
    return reactions.findIndex((reaction: Reaction) => reaction.id === reactionId);
  }

  /**
   * Entfernt einen Benutzer aus einer Reaktion.
   * 
   * @param {Reaction} reaction - Die Reaktion, bei der der Benutzer entfernt werden soll.
   * @param {string} username - Der Benutzername des aktuellen Benutzers.
   */
  removeUserFromReaction(reaction: Reaction, username: string) {
    delete reaction.reactedUser[username];
    reaction.counter = Object.keys(reaction.reactedUser).length;
  }

  /**
   * Entfernt eine Reaktion aus einer Nachricht.
   * 
   * @param {any} message - Die Nachricht, bei der die Reaktion entfernt werden soll.
   * @param {number} reactionIndex - Der Index der zu entfernenden Reaktion.
   */
  removeReactionFromMessage(message: any, reactionIndex: number) {
    message.reactions.splice(reactionIndex, 1);
  }

  /**
   * Fügt einen Benutzer zu einer Reaktion hinzu.
   * 
   * @param {Reaction} reaction - Die Reaktion, zu der der Benutzer hinzugefügt werden soll.
   * @param {string} username - Der Benutzername des aktuellen Benutzers.
   */
  addUserToReaction(reaction: Reaction, username: string) {
    reaction.reactedUser[username] = true;
    reaction.counter = Object.keys(reaction.reactedUser).length;
  }


}
