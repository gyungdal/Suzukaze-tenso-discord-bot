import { BaseService } from "../base/baseService";
import { Message } from "discord.js";
import { BotMessage } from "../struct/message";
import { IBot } from "../struct/api";

export class Say extends BaseService {
    constructor(bot : IBot){
        super(bot);
        this._name = "say";
        this._priority = 50;
    }

    async execute(msg : Message){
        const reply = await msg.reply(`SAY : ${msg.content}`);
        setTimeout(()=>{
            msg.channel.bulkDelete([msg, reply]);
        }, 1000);
    }

    isValid(msg : Message) : boolean {
        return this.argv.includes(msg.author.id);
    }
}