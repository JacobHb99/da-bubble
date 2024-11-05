import { Message } from "./message.model";

export class Thread {
    id: string;
    rootMessage: string;
    messages: Message[];

    constructor(obj?: Partial<Thread>){
        this.id = obj?.id ?? '';
        this.rootMessage = obj?.rootMessage ?? '';
        this.messages = obj?.messages ?? [];
    }
}