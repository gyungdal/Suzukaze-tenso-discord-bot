import { BaseService } from "../base/baseService";
import { Message } from "discord.js";
import { IBot, ServiceExecuteResultType } from "../struct/api";

export class Ban extends BaseService {
    constructor(bot : IBot){
        super(bot);
        this._name = "ban";
        this._priority = 100;
    }

    async execute(msg : Message) : Promise<ServiceExecuteResultType> {
        if(this.argv.includes(msg.author.id)){
            if(msg.deletable){
                await msg.delete();
            }
        }
        return Promise.resolve(ServiceExecuteResultType.CLEAR);
    }

    isValid(msg : Message) : boolean {
        return this.argv.includes(msg.author.id);
    }

    
}