import { Thread } from "./thread.model";

export class Message {
    msgId: string;
    timeStamp: number;
    senderId: string;
    recipientId:string;
    text: string;
    thread?: Thread;
    //reactions: [];

    constructor(obj?: Partial<Message>) {
        this.msgId = obj?.msgId ?? '';
        this.timeStamp = obj?.timeStamp ?? 0;
        this.senderId = obj?.senderId ?? '';
        this.recipientId = obj?.recipientId ?? '';
        this.text = obj?.text ?? '';
        this.thread = obj?.thread;
        //this.reactions = obj?.reactions: [];
    }

    public getJSON() {
        return {
            msgId: this.msgId,
            timeStamp: this.timeStamp,
            senderId: this.senderId,
            recipientId: this.recipientId,
            text: this.text,
            thread: this.thread,
            //reactions: this.reactions          
        };
    }
}