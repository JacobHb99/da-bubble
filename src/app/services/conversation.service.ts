import { inject, Injectable } from '@angular/core';
import { doc, addDoc, setDoc, Firestore, updateDoc, collection, onSnapshot, query } from '@angular/fire/firestore';
import { User } from '../models/user.model';
import { Conversation } from '../models/conversation.model';
import { UserCredential } from '@angular/fire/auth';
import { where, } from "firebase/firestore";
import { AuthService } from './../services/auth.service';
import { InterfaceService } from './../services/interface.service';

@Injectable({
    providedIn: 'root'
})
export class ConversationService {
    firestore = inject(Firestore);
    authService = inject(AuthService);
    uiService = inject(InterfaceService);
    allConv: any = [];
    conversation: any;
    currentConversation = new Conversation();

    constructor() { }

    async startConversation(user:any) {
        let partnerId: string = user.uid;
        let creatorId = this.authService.currentUserSig()?.uid;
        this.createNewConversation(creatorId, partnerId)
        this.uiService.changeContent('directMessage');
    }
    

    async createNewConversation(creatorId: any, partnerId: any) {
        this.currentConversation = new Conversation();
        this.currentConversation.creatorId = creatorId;
        this.currentConversation.partnerId = partnerId;
        await this.addConversation(this.currentConversation);
    }

    async addConversation(conversation: any) {
        const conData = conversation.getJSON();
        const conversationRef = await addDoc(collection(this.firestore, "conversations"), conData)
        conData.conId = conversationRef.id,
            await setDoc(conversationRef, conData);
        console.log('NewconData', conData)
    }

    // async startConversation(partnerId: string) {
    //     let creatorId = this.authService.currentUserSig()?.uid;
    //     let existCon = this.searchConversation(creatorId, partnerId)
    //     if (existCon) {
    //         this.currentConversation = new Conversation();
    //     } else {
    //         await this.createNewConversation(creatorId, partnerId)
    //     }
    // }

    // searchConversation(creatorId: any, partnerId: string): Conversation | any {
    //     for (let i = 0; i < this.allConv.length; i++) {
    //         const conversation = this.allConv[i];
    //         const searchedCreatorId = conversation.creatorId;
    //         const searchedPartnerId = conversation.partnerId;
    //         if (creatorId === searchedCreatorId && partnerId === searchedPartnerId) {
    //             return new Conversation(conversation);
    //         }
    //     }
    // }



}