import { Thread } from "./thread.model";

export class Message {
    msgId: string;
    timeStamp: number;
    senderId: string | unknown;
    recipientId: string;
    text: string;
    thread?: Thread;
    reactions: Reaction[];

    constructor(obj?: Partial<Message>) {
        this.msgId = obj?.msgId ?? '';
        this.timeStamp = obj?.timeStamp ?? 0;
        this.senderId = obj?.senderId ?? '';
        this.recipientId = obj?.recipientId ?? '';
        this.text = obj?.text ?? '';
        this.thread = obj?.thread;
        this.reactions = obj?.reactions ?? [];
    }

    public getJSON(message:Message) {
        return {
            msgId: this.msgId,
            timeStamp: this.timeStamp,
            senderId: this.senderId,
            recipientId: this.recipientId,
            text: this.text,
            thread: this.thread,
            reactions: this.reactions
        };
    }
}

export class Reaction {
    counter: number;
    id: string;
    fromUser: string[];

    constructor(obj?: Partial<Reaction>) {
        this.counter = obj?.counter ?? 0;
        this.id = obj?.id ?? '';
        this.fromUser = obj?.fromUser ?? [];
    }
}
