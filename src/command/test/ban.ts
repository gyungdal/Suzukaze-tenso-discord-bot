import { IBot, ICommand, ICommandDescription, CommandType } from "../../struct/api";
import { Message } from "discord.js";
import { BotMessage } from "../../struct/message";
export class Ban implements ICommand {
    public readonly bot: IBot;
    constructor(bot: IBot) {
        this.bot = bot;
    }

    get help(): ICommandDescription {
        return {
            type: CommandType.TEST,
            command: "ban",
            desc: '메세지 제거'
        }
    }

    isValid(msg: Message): boolean {
        if (msg.mentions.users.has(this.bot.config.id)) {
            if(msg.content.split(' ').length < 2){
                return false;
            }
            const check = msg.content.split(' ')[1].toLowerCase()
                === this.help.command;
            this.bot.logger.info(`${this.help.command} : ${check}`);
            return check;
        }
        return false;
    }

    async process(msg: Message): Promise<Boolean> {
        const users = msg.mentions.users.filter(value => value.id !== this.bot.client.user.id);
        this.bot.serviceManager.find(this.help.command).then(service =>{
            if(users.size == 0){
                return Promise.reject("no number");
            }else{
                const id = users.map(value => value.id);
                this.bot.logger.info(`ban list : ${id.join(', ')}`);
                if(msg.cleanContent.includes("!")){
                    for (const value of id.values()) {
                        this.bot.logger.info(`ban remove : ${value}`);
                        service.removeArgv(value);
                    }
                }else{
                    for (const value of id.values()) {
                        this.bot.logger.info(`ban add : ${value}`);
                        service.addOrSetArgv(value);
                    }
                }
            }
            msg.react("✅");
        }, reject=>{
            this.bot.logger.error(reject);
        });
        return Promise.resolve(true);
    }
}