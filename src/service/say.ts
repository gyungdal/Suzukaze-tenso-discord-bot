import { BaseService } from "./baseService";
import { Message } from "discord.js";
import { BotMessage } from "../struct/message";
import { IBot } from "../struct/api";

export class Say extends BaseService {
    constructor(bot : IBot){
        super(bot);
        this._name = "say";
        this._priority = 100;
    }

    async execute(msg : Message) {
        const reply = await msg.reply(`SAY : ${msg.content}`);
        setTimeout(()=>{
            msg.channel.bulkDelete([msg, reply]);
        }, 1000);
    }
}