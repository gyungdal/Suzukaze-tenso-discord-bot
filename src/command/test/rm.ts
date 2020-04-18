import { IBot, ICommand, ICommandDescription, CommandType } from "../../struct/api";
import { Message } from "discord.js";
import { BotMessage } from "../../struct/message";
export class Ping implements ICommand {
    public readonly bot: IBot;
    constructor(bot: IBot) {
        this.bot = bot;
    }

    get help(): ICommandDescription {
        return {
            type: CommandType.TEST,
            command: "rm",
            desc: '메세지 제거'
        }
    }

    isValid(msg: Message): boolean {
        if (msg.mentions.users.has(this.bot.config.id)) {
            if(msg.content.split(' ').length < 2){
                return false;
            }
            const check = msg.content.split(' ').includes(this.help.command);
            this.bot.logger.info(`${this.help.command} : ${check}`);
            return check;
        }
        return false;
    }

    async process(msg: Message): Promise<Boolean> {
        const countParse = Number(msg.content.split(' ')[2]);
        let count;
        if (Number.isNaN(countParse)) {
            count = 1;
        } else {
            count = countParse;
        }
        return msg.channel.fetchMessages({ limit: count })
            .then(success => msg.channel.bulkDelete(success)
                , reject => Promise.reject(reject))
            .then(sucess => Promise.resolve(true)
                , reject => Promise.reject(reject));
    }
}