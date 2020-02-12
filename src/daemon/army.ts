import { BaseDaemon } from "./base";
import { Client, Message, User } from "discord.js";

export class Army extends BaseDaemon {
    private lastKey: number;
    constructor() {
        super();
        this._name = "army";
        this.lastKey = 0;
    }

    execute(client: Client): Promise<boolean> {
        const userList = client.users.filter((user: User) => {
            return this.id.includes(user.id);
        }).array();
        if (userList.length < 1) {
            return Promise.reject("No Users");
        }
        userList.forEach((user)=>{
            user.sendMessage("TEST");
        });
        return Promise.resolve(true);
    }
}