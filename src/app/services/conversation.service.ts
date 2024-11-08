import { inject, Injectable } from '@angular/core';
import { doc, addDoc, setDoc, Firestore, updateDoc, collection, onSnapshot, query } from '@angular/fire/firestore';
import { User } from '../models/user.model';
import { Conversation } from '../models/conversation.model';
import { UserCredential } from '@angular/fire/auth';
import { where, } from "firebase/firestore";
import { AuthService } from './../services/auth.service';
import { InterfaceService } from './../services/interface.service';
import { FirebaseService } from './firebase.service';

@Injectable({
    providedIn: 'root'
})
export class ConversationService {
    FiBaService = inject(FirebaseService);
    firestore = inject(Firestore);
    authService = inject(AuthService);
    uiService = inject(InterfaceService);
    allConv: any = [];
    conversation: any;
    currentConversation = new Conversation();

    constructor() { }

    async startConversation(user: any) {
        this.getAllConversations();
        let partnerId = user.uid
        console.log("partnerId", partnerId)
        let creatorId = this.authService.currentUserSig()?.uid;
        let existCon: Conversation = this.searchConversation(creatorId, partnerId)
        if (existCon) {
            this.currentConversation = new Conversation(existCon);
            console.log("existConv", this.currentConversation)
        } else {
            await this.createNewConversation(creatorId, partnerId)
            console.log("newConv", this.currentConversation)
        }
    }

    async createNewConversation(creatorId: any, partnerId: any) {
        this.currentConversation = new Conversation();
        this.currentConversation.creatorId = creatorId;
        this.currentConversation.partnerId = partnerId;
        await this.addConversation(this.currentConversation);
    }

    async addConversation(conversation: any) {
        const conData = this.getCleanJSON(conversation);
        const conversationRef = await addDoc(collection(this.firestore, "conversations"), conData)
        conData.conId = conversationRef.id,
            await setDoc(conversationRef, conData).catch((err) => {
                console.log('Error adding Conversation to firebase', err);
            });
        this.getAllConversations()
    }

    searchConversation(creatorId: unknown, partnerId: string): Conversation | any {
        for (let i = 0; i < this.FiBaService.allConversations.length; i++) {
            const conversation: Conversation = this.FiBaService.allConversations[i];
            const searchedCreatorId = conversation.creatorId;
            const searchedPartnerId = conversation.partnerId;

            if (creatorId === searchedCreatorId && partnerId === searchedPartnerId
                ||
                creatorId === searchedPartnerId && partnerId === searchedCreatorId) {
                return conversation;
            }
        }
    }

    async getAllConversations() {
        const q = query(collection(this.firestore, "conversations"));
        const unsubscribedConv = onSnapshot(q, (querySnapshot) => {
            this.FiBaService.allConversations = [];
            querySnapshot.forEach((doc) => {
                const conv = this.setConversationObject(doc.data());
                this.FiBaService.allConversations.push(conv);
            });

        });
        console.log("allVonv", this.FiBaService.allConversations)
    }

    setConversationObject(conversation: any): Conversation {
        return {
            conId: conversation.conId || '',
            creatorId: conversation.creatorId || '',
            partnerId: conversation.partnerId || '',
            messages: conversation.messages || [],
            active: conversation.active || false,
        };
    }

    getCleanJSON(conversation: Conversation) {
        return {
            conId: conversation.conId,
            creatorId: conversation.creatorId,
            partnerId: conversation.partnerId,
            messages: conversation.messages,
            active: conversation.active,
        };
    }



}