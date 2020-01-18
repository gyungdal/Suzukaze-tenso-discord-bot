import { IBot, ICommand, IMessage, ICommandDescription, CommandType } from "../struct/api";
import { Message } from "discord.js";
import { BotMessage } from "../struct/message";

export class Help implements ICommand {
    public readonly bot: IBot;
    constructor(bot: IBot) {
        this.bot = bot;
    }

    getHelp(): ICommandDescription {
        return {
            type: CommandType.HELP,
            command: "help",
            desc: '명령어 확인'
        }
    }

    isValid(msg: Message): boolean {
        if (msg.mentions.users.has(this.bot.config.id)) {
            const check = msg.content.split(' ')[1].toLowerCase()
                        .includes(this.getHelp().command);
            this.bot.logger.info(`${this.getHelp().command} : ${check}`);
            return check;
        }
        return false;
    }

    process(msg: Message): Promise<Boolean> {
        const message = new BotMessage(msg);
        const helpMap = new Map();
        this.bot.commands.forEach((command)=>{
            const help = command.getHelp();
            if(helpMap.has(help.type)){
                const value : String = helpMap.get(help.type);
                helpMap.set(help.type.toString(), `${value}, ${help.command}`);
            }else{
                helpMap.set(help.type.toString(), help.command);
            }
        });
        message.setTitle(this.getHelp().desc);
        helpMap.forEach((value, key, map)=>{
            message.addField(key, value);
        });
        return message.sendReply()
            .then((resolve) => {
                setTimeout(() => {
                    //array인지 체크
                    if (Array.isArray(resolve)) {
                        const sendMessages: Message[] = resolve as Message[];
                        sendMessages.forEach(value => {
                            if (value.deletable) {
                                value.delete();
                            }
                        });
                    } else {
                        const sendMessage: Message = resolve as Message;
                        if (sendMessage.deletable) {
                            sendMessage.delete();
                        }
                    }
                }, 1000 * 10);
                return Promise.resolve(true);
            }, (reject) => {
                return Promise.reject(reject);
            });
    }
}