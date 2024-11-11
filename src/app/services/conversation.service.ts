import { inject, Injectable } from '@angular/core';
import { doc, addDoc, setDoc, Firestore, updateDoc, collection, onSnapshot, query } from '@angular/fire/firestore';
import { User } from '../models/user.model';
import { Conversation } from '../models/conversation.model';
import { where, } from "firebase/firestore";
import { AuthService } from './../services/auth.service';
import { InterfaceService } from './../services/interface.service';
import { FirebaseService } from './firebase.service';
import { UserDataService } from './user.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ConversationService {
    FiBaService = inject(FirebaseService);
    firestore = inject(Firestore);
    authService = inject(AuthService);
    uiService = inject(InterfaceService);

    private allConvSubject = new BehaviorSubject<any>(null);
    selectedConv = this.allConvSubject.asObservable();

    constructor(private userDataService: UserDataService) { }

    async startConversation(user: any) {
        this.getAllConversations();
        let partnerId = user.uid
        //console.log("partnerId", partnerId)
        let creatorId = this.authService.currentUserSig()?.uid;
        let existCon: Conversation = this.searchConversation(creatorId, partnerId)
        if (existCon) {
            this.FiBaService.currentConversation = new Conversation(existCon);
            this.showUserChat(user);
            console.log("existConv", this.FiBaService.currentConversation)
            this.listenToCurrentConversationChanges(this.FiBaService.currentConversation.conId);
        } else {
            await this.createNewConversation(creatorId, partnerId)
            this.showUserChat(user);
            console.log("newConv", this.FiBaService.currentConversation)
            this.listenToCurrentConversationChanges(this.FiBaService.currentConversation.conId);
        }
    }

 

    async createNewConversation(creatorId: any, partnerId: any) {
        this.FiBaService.currentConversation = new Conversation();
        this.FiBaService.currentConversation.creatorId = creatorId;
        this.FiBaService.currentConversation.partnerId = partnerId;
        await this.addConversation(this.FiBaService.currentConversation);
    }

    async addConversation(conversation: any) {
        const conData = this.getCleanJSON(conversation);
        const conversationRef = await addDoc(collection(this.firestore, "conversations"), conData)
        conData.conId = conversationRef.id,
            await setDoc(conversationRef, conData).catch((err) => {
                console.log('Error adding Conversation to firebase', err);
            });
        this.getAllConversations();       
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
        console.log("allConv", this.FiBaService.allConversations)
    }

    listenToCurrentConversationChanges(conversationId: any) {
        const conversationRef = doc(this.firestore, `conversations/${conversationId}`);
        onSnapshot(conversationRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const updatedConversation = this.setConversationObject(docSnapshot.data());
                this.FiBaService.currentConversation = updatedConversation;
            }
        });
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

    showUserChat(user: any) {
        this.userDataService.setUser(user);
        this.uiService.changeContent('directMessage');
      }



}