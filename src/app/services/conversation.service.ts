import { inject, Injectable } from '@angular/core';
import { doc, addDoc, setDoc, Firestore, updateDoc, collection, onSnapshot, query } from '@angular/fire/firestore';
import { User } from '../models/user.model';
import { Conversation } from '../models/conversation.model';
import { UserCredential } from '@angular/fire/auth';
import { where, } from "firebase/firestore";
import { AuthService } from './../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class ConversationService {
    firestore = inject(Firestore);
    authService = inject(AuthService);
    allConv: any = [];
    conversation: any;
    currentConversation = new Conversation();

    constructor() { }

    startConversation(partnerId: string) {
        let creatorId = this.authService.currentUserSig()?.uid;
        console.log('creatorId', creatorId)
        //this.createNewConversation(creatorId, partnerId)
    }

    // getCurrentUser(){
    //     let currentUser = this.authService.currentUserSig.uid;
    // }

    // async createNewConversation(creatorId: string, partnerId: string) {
    //     this.currentConversation = new Conversation();
    //     this.currentConversation.creatorId = creatorId;
    //     this.currentConversation.partnerId = partnerId;
    //     await this.addConversation(this.currentConversation);
    // }

    // async addConversation(conversation: any) {
    //     const conId = conversation.conId;
    //     const conData = conversation.getJSON();
    //     console.log('ConvLog', conversation)
    //     await setDoc(doc(this.firestore, "conversation", conId), conData)
    // }

    // async getAllConversations() {
    //     const q = query(collection(this.firestore, "conversation"));
    //     const unsubscribedUsers = onSnapshot(q, (querySnapshot) => {
    //         this.allConv = [];
    //         querySnapshot.forEach((doc) => {
    //             this.allConv.push(doc.data());
    //         });
    //         console.log("Current allConv: ", this.allConv);
    //     });
    // }

}