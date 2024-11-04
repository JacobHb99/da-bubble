import { Thread } from "./thread.class";

export class Message {
    mid: string;
    timeStamp: number;
    sender: string;
    text: string;
    thread?: Thread;
    //reactions: [];

    constructor(obj?: Partial<Message>) {
        this.mid = obj?.mid ?? '';
        this.timeStamp = obj?.timeStamp ?? 0;
        this.sender = obj?.sender ?? '';
        this.text = obj?.text ?? '';
        this.thread = obj?.thread;
        //this.reactions = obj?.reactions: [];
    }

    public getJSON() {
        return {
            mid: this.mid,
            timeStamp: this.timeStamp,
            sender: this.sender,
            text: this.text,
            thread: this.thread,
            //reactions: this.reactions          
        };
    }
}