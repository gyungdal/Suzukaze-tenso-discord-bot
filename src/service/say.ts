import { BaseService } from "../base/baseService";
import { Message } from "discord.js";
import { BotMessage } from "../struct/message";
import { IBot, ServiceExecuteResultType } from "../struct/api";

export class Say extends BaseService {
    constructor(bot : IBot){
        super(bot);
        this._name = "say";
        this._priority = 50;
    }

    async execute(msg : Message) : Promise<ServiceExecuteResultType> {
        const reply = await msg.reply(`SAY : ${msg.content}`);
        setTimeout(()=>{
            msg.channel.bulkDelete([msg, reply]);
        }, 1000);
        return Promise.resolve(ServiceExecuteResultType.CLEAR);
    }

    isValid(msg : Message) : boolean {
        return this.argv.includes(msg.author.id);
    }
}