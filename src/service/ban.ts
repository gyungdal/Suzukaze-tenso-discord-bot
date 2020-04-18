import { BaseService } from "../base/baseService";
import { Message } from "discord.js";
import { IBot } from "../struct/api";

export class Ban extends BaseService {
    constructor(bot : IBot){
        super(bot);
        this._name = "ban";
        this._priority = 100;
    }

    async execute(msg : Message)  {
        if(this.argv.includes(msg.author.id)){
            if(msg.deletable){
                await msg.delete();
            }
        }
    }

    isValid(msg : Message) : boolean {
        return this.argv.includes(msg.author.id);
    }

    
}