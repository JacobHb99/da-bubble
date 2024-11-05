import { Message } from "./message.class";

export class Conversation {
    conId: string;
    creatorId:string;
    interlocutorId: string;
    messages: Message[];
    active: boolean;

    constructor(obj?: Partial<Conversation>) {
        this.conId = obj?.conId ?? '';
        this.creatorId = obj?.creatorId ?? '';
        this.interlocutorId = obj?.interlocutorId ?? '';
        this.messages = obj?.messages ?? [];
        this.active = obj?.active ?? false;
    }
}
