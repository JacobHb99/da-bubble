import { Message } from "./message.model";

export class Conversation {
    conId: string | unknown;;
    creatorId: string;
    partnerId: string; //Gesprächspartner
    messages: Message[];
    active: boolean;

    constructor(obj?: Partial<Conversation>) {
        this.conId = obj?.conId ?? '';
        this.creatorId = obj?.creatorId ?? '';
        this.partnerId = obj?.partnerId ?? '';
        this.messages = obj?.messages ?? [];
        this.active = obj?.active ?? false;
    }

    getJSON() {
        return {
            conId: this.conId,
            creatorId: this.creatorId,
            partnerId: this.partnerId,
            messages: this.messages,
            active: this.active,
        };
    }
}
