import { Message } from "./message.model";
import { User } from "./user.model";

export class Conversation {
    conId: string | unknown;;
    creatorId: string;
    partnerId: string; //Gesprächspartner
    messages: Message[];
    active: boolean;
    user: string[];

    constructor(obj?: Partial<Conversation>) {
        this.conId = obj?.conId ?? '';
        this.creatorId = obj?.creatorId ?? '';
        this.partnerId = obj?.partnerId ?? '';
        this.messages = obj?.messages ?? [];
        this.active = obj?.active ?? false;
        this.user = obj?.user ?? [];
    }


}
