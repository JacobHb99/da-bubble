export class ChannelData {   
    title: string;
    description: string;
    users: string[];
    //collection: string; ->evtl. Sammlung aller nachrichten 

    constructor(obj?: any) {       
        this.title = obj ? obj.title : "";
        this.description = obj ? obj.description : "";
        this.users = obj ? obj.users : [];
        //this.collection = obj ? obj.collection : "";
    }

    public getJSON() {
        return {
            title: this.title,
            description: this.description,
            users: this.users,
            //collection: this.collection,
        };
    }
}