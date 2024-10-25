export interface UserInterface {
    uid: string | unknown;
    email: string;
    username: string;
    avatar: string;
    status: 'online' | 'offline';
}
