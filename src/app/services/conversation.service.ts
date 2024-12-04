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
import { SearchbarService } from './searchbar.service';

@Injectable({
    providedIn: 'root'
})
export class ConversationService {
    FiBaService = inject(FirebaseService);
    firestore = inject(Firestore);
    authService = inject(AuthService);
    uiService = inject(InterfaceService);

    // private allConvSubject = new BehaviorSubject<any>(null);
    // selectedConv = this.allConvSubject.asObservable();

    constructor(private userDataService: UserDataService, private searchbarSearvice: SearchbarService) {
    }

    async startConversation(user: any) {
        let partnerId = user.uid
        let creatorId = this.authService.currentUserSig()?.uid;
        let existCon = this.searchConversation(creatorId, partnerId)

        if (existCon) {
            this.FiBaService.currentConversation = new Conversation(existCon);
            this.showUserChat(user);
            //console.log("existConv", this.FiBaService.currentConversation)
            this.listenToCurrentConversationChanges(this.FiBaService.currentConversation.conId);
        } else {
            await this.createNewConversation(creatorId, partnerId)
            this.showUserChat(user);
            // console.log("newConv", this.FiBaService.currentConversation)
            this.listenToCurrentConversationChanges(this.FiBaService.currentConversation.conId);
        }
        this.searchbarSearvice.emptyInput();
    }


    async createNewConversation(creatorId: any, partnerId: any) {
        this.FiBaService.currentConversation = new Conversation();
        this.FiBaService.currentConversation.creatorId = creatorId;
        this.FiBaService.currentConversation.partnerId = partnerId;
        this.FiBaService.currentConversation.user = [creatorId, partnerId];
        await this.addConversation(this.FiBaService.currentConversation);
    }

    listenToCurrentConversationChanges(conversationId: any) {
        const conversationRef = doc(this.firestore, `conversations/${conversationId}`);
        const unsubscribe = onSnapshot(conversationRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const updatedConversation = this.FiBaService.setConversationObject(docSnapshot.data());
                this.FiBaService.currentConversation = updatedConversation;
            }
        });
        this.FiBaService.registerListener(unsubscribe);
    }

    async addConversation(conversation: any) {
        const conData = this.getCleanJSON(conversation);
        const conversationRef = await addDoc(collection(this.firestore, "conversations"), conData)
        conData.conId = conversationRef.id,
            this.FiBaService.currentConversation.conId = conData.conId
        await setDoc(conversationRef, conData).catch((err) => {
            console.log('Error adding Conversation to firebase', err);
        });
        this.FiBaService.getAllConversations();
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


    getCurrentConversation(user: User) {
        let partnerId = user.uid as string
        let creatorId = this.authService.currentUserSig()?.uid;
        return this.searchConversation(creatorId, partnerId)
    }

    // async getAllConversations() {
    //     const q = query(collection(this.firestore, "conversations"));
    //     const unsubscribe = onSnapshot(q, (querySnapshot) => {
    //         this.FiBaService.allConversations = [];
    //         querySnapshot.forEach((doc) => {
    //             const conv = this.setConversationObject(doc.data());
    //             this.FiBaService.allConversations.push(conv);
    //         });

    //     });
    //     this.FiBaService.registerListener(unsubscribe);
    //     console.log("allConvgetAllConv", this.FiBaService.allConversations)
    // }

    // setConversationObject(conversation: any): Conversation {
    //     return {
    //         conId: conversation.conId || '',
    //         creatorId: conversation.creatorId || '',
    //         partnerId: conversation.partnerId || '',
    //         messages: conversation.messages || [],
    //         active: conversation.active || false,
    //     };
    // }

    getCleanJSON(conversation: Conversation) {
        return {
            conId: conversation.conId,
            creatorId: conversation.creatorId,
            partnerId: conversation.partnerId,
            messages: conversation.messages,
            active: conversation.active,
            user: conversation.user
        };
    }

    showUserChat(user: any) {
        this.userDataService.setUser(user);
        this.uiService.changeContent('directMessage');
        this.uiService.closeThread();
    }

    searchForConversation(foundUser: User) {
        let allConv = this.FiBaService.allConversations;
        const currentUserUid = this.authService.currentUserSig()?.uid;

        // Filtere die Conversation basierend auf den User-IDs
        const filteredConversation = allConv.find((conv: any) =>
            conv.user.includes(foundUser.uid) && conv.user.includes(currentUserUid)
        );

        return filteredConversation as Conversation;
    }



}