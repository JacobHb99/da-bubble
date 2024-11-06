import { Conversation } from "./conversation.model";

export class User {
    uid: string | unknown;
    email: string;
    username: string;
    avatar: string;
    status: 'online' | 'offline';
    channels: Conversation[];

    constructor(obj?: Partial<User>){
        this.uid = obj?.uid ?? '';
        this.email = obj?.email ?? '';
        this.username = obj?.username ?? '';
        this.avatar = obj?.avatar ?? '';
        this.status = obj?.status ?? 'offline';
        this.channels = obj?.channels ?? [];
    }

    getJSON() {
        return {
          uid: this.uid,
          email: this.email,
          username: this.username,
          avatar: this.avatar,
          status: this.status,
          channels: this.channels
        };
      }
}
