import { Message } from "./message.model";

export class ChannelData {   
    chaId:string;
    title: string;
    creatorId:string;
    description: string;
    users: string[];
    messages: Message[];
    comments: string[];
    reactions: string[];

    constructor(obj?: any) {    
        this.chaId = obj?.chaId ?? ''; 
        this.title = obj ? obj.title : "";
        this.creatorId = obj ? obj.creatorId : "";
        this.description = obj ? obj.description : "";
        this.users = obj ? obj.users : [];
        this.messages = obj?.messages ?? [];
        this.comments = obj?.comments ?? [];
        this.reactions = obj?.reactions ?? [];
    }

}