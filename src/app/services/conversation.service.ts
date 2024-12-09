import { inject, Injectable } from '@angular/core';
import { doc, addDoc, setDoc, Firestore, collection, onSnapshot} from '@angular/fire/firestore';
import { User } from '../models/user.model';
import { Conversation } from '../models/conversation.model';
import { AuthService } from './../services/auth.service';
import { InterfaceService } from './../services/interface.service';
import { FirebaseService } from './firebase.service';
import { UserDataService } from './user.service';
import { SearchbarService } from './searchbar.service';

@Injectable({
    providedIn: 'root'
})
export class ConversationService {
    FiBaService = inject(FirebaseService);
    firestore = inject(Firestore);
    authService = inject(AuthService);
    uiService = inject(InterfaceService);

    constructor(private userDataService: UserDataService, private searchbarSearvice: SearchbarService) {
    }

    /**
     * Startet eine neue Konversation oder öffnet eine bestehende Konversation zwischen dem aktuellen Benutzer und einem anderen Benutzer.
     *
     * @param {any} user - Das Zielbenutzerobjekt mit den UID-Daten.
     * @param {string} [openChat] - Optionaler Parameter, um eine geöffnete Konversation anzuzeigen.
     * @returns {Promise<void>} Eine Promise, die abschließt, wenn die Konversation gestartet oder geöffnet wurde.
     */
    async startConversation(user: any, openChat?: string) {
        let partnerId = user.uid
        let creatorId = this.authService.currentUserSig()?.uid;
        let existCon = this.searchConversation(creatorId, partnerId)
        if (existCon) {
            this.FiBaService.currentConversation = new Conversation(existCon);
            if (openChat) {
            } else {
                this.showUserChat(user);
            }
            this.listenToCurrentConversationChanges(this.FiBaService.currentConversation.conId);
        } else {
            await this.createNewConversation(creatorId, partnerId)
            if (openChat) {
            } else {
                this.showUserChat(user);
            }
            this.listenToCurrentConversationChanges(this.FiBaService.currentConversation.conId);
        }
        this.searchbarSearvice.emptyInput();
    }

    /**
     * Erstellt eine neue Konversation zwischen dem aktuellen Benutzer und einem Partner.
     *
     * @param {any} creatorId - Die UID des aktuellen Benutzers.
     * @param {any} partnerId - Die UID des Partnerbenutzers.
     * @returns {Promise<void>} Eine Promise, die abschließt, wenn die Konversation erstellt wurde.
     */
    async createNewConversation(creatorId: any, partnerId: any) {
        this.FiBaService.currentConversation = new Conversation();
        this.FiBaService.currentConversation.creatorId = creatorId;
        this.FiBaService.currentConversation.partnerId = partnerId;
        this.FiBaService.currentConversation.user = [creatorId, partnerId];
        await this.addConversation(this.FiBaService.currentConversation);
    }

    /**
     * Abonnieren auf Änderungen einer bestimmten Konversation im Firebase Firestore.
     *
     * @param {any} conversationId - Die ID der Konversation.
     */
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

    /**
     * Fügt eine neue Konversation zu Firebase hinzu.
     *
     * @param {any} conversation - Das Konversationsobjekt, das hinzugefügt werden soll.
     * @returns {Promise<void>} Eine Promise, die abschließt, wenn die Konversation erfolgreich hinzugefügt wurde.
     */
    async addConversation(conversation: any) {
        const conData = this.getCleanJSON(conversation);
        const conversationRef = await addDoc(collection(this.firestore, "conversations"), conData)
        conData.conId = conversationRef.id,
            this.FiBaService.currentConversation.conId = conData.conId
        await setDoc(conversationRef, conData).catch((err) => {
            console.error('Error adding Conversation to firebase', err);
        });
        this.FiBaService.getAllConversations();
    }

    /**
     * Sucht nach einer bestehenden Konversation zwischen dem aktuellen Benutzer und einem Partner.
     *
     * @param {unknown} creatorId - Die UID des aktuellen Benutzers.
     * @param {string} partnerId - Die UID des Partnerbenutzers.
     * @returns {Conversation | any} Das gefundenen Konversationsobjekt oder `undefined`, wenn keine Konversation gefunden wird.
     */
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

    /**
     * Gibt die aktuelle Konversation des Benutzers zurück.
     *
     * @param {User} user - Das Benutzerobjekt des Partners.
     * @returns {Conversation} Die Konversationsinstanz.
     */
    getCurrentConversation(user: User) {
        let partnerId = user.uid as string
        let creatorId = this.authService.currentUserSig()?.uid;
        return this.searchConversation(creatorId, partnerId)
    }

    /**
     * Bereitet ein Konversationsobjekt für die Speicherung in Firebase vor.
     *
     * @param {Conversation} conversation - Das Konversationsobjekt, das in ein JSON umgewandelt werden soll.
     * @returns {Object} Das umgewandelte JSON-Objekt.
     */
    getCleanJSON(conversation: Conversation) {
        return {
            conId: conversation.conId,
            creatorId: conversation.creatorId,
            partnerId: conversation.partnerId,
            messages: conversation.messages,
            user: conversation.user
        };
    }

    /**
     * Zeigt den Chat mit einem bestimmten Benutzer an.
     *
     * @param {any} user - Das Benutzerobjekt des Partners.
     */
    showUserChat(user: any) {
        this.userDataService.setUser(user);
        this.uiService.changeContent('directMessage');
        this.uiService.closeThread();
    }

    /**
     * Sucht nach einer Konversation, an der der aktuelle Benutzer und ein Zielbenutzer beteiligt sind.
     *
     * @param {User} foundUser - Das Zielbenutzerobjekt.
     * @returns {Conversation} Das gefundene Konversationsobjekt oder `undefined`, wenn keine Konversation existiert.
     */
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