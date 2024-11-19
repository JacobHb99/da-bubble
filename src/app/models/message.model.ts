import { Thread } from "./thread.model";

export class Message {
    msgId: string;
    timeStamp: number;
    senderId: string | unknown;
    //recipientId: string; //Benötigt??
    text: string;
    thread?: Thread;
    reactions: Reaction[];

    constructor(obj?: Partial<Message>) {
        this.msgId = obj?.msgId ?? '';
        this.timeStamp = obj?.timeStamp ?? 0;
        this.senderId = obj?.senderId ?? '';
        //this.recipientId = obj?.recipientId ?? '';
        this.text = obj?.text ?? '';
        this.thread = obj?.thread;
        this.reactions = obj?.reactions ?? [];
    }
}

export class Reaction {
    counter: number;
    id: string;
    reactedUser: string[];

    constructor(obj?: Partial<Reaction>) {
        this.counter = obj?.counter ?? 0;
        this.id = obj?.id ?? '';
        this.reactedUser = obj?.reactedUser ?? [];
    }
}
