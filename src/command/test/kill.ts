import { IBot, ICommand, ICommandDescription, CommandType } from "../../struct/api";
import { Message } from "discord.js";
import { BotMessage } from "../../struct/message";
import { exit } from "process";
export class Ban implements ICommand {
    public readonly bot: IBot;
    constructor(bot: IBot) {
        this.bot = bot;
    }

    get help(): ICommandDescription {
        return {
            type: CommandType.TEST,
            command: "kill",
            desc: 'tenso 종료'
        }
    }

    isValid(msg: Message): boolean {
        if (msg.mentions.users.has(this.bot.config.id)) {
            if(msg.content.split(' ').length < 2){
                return false;
            }
            const check = msg.content.split(' ').includes(this.help.command);
            console.log(this.bot.config.adminId.join(', '));
            const user = this.bot.config.adminId.includes(msg.author.id);
            this.bot.logger.info(`${this.help.command} : ${check}`);
            return check && user;
        }
        return false;
    }

    async process(msg: Message): Promise<Boolean> {
        exit(0);
    }
}