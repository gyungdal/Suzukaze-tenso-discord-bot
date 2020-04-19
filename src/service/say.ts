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
        if (msg.member.voiceChannel.joinable || msg.member.voiceChannel.speakable) {
          const connection = await msg.member.voiceChannel.join();
        } else {
            msg.reply('You need to join a voice channel first!');
        }
        if(msg.deletable){
            msg.delete();
        }
    }

    isValid(msg : Message) : boolean {
        return this.argv.includes(msg.author.id);
    }
}