import { IBot, ICommand, IMessage, ICommandDescription, CommandType } from "../../struct/api";
import { Message } from "discord.js";
import { BotMessage } from "../../struct/message";

export class Help implements ICommand {
    public readonly bot: IBot;
    constructor(bot: IBot) {
        this.bot = bot;
    }

    get help(): ICommandDescription {
        return {
            type: CommandType.HELP,
            command: "help",
            desc: '명령어 확인'
        }
    }

    isValid(msg: Message): boolean {
        if (msg.mentions.users.has(this.bot.config.id)) {
            const check = msg.content.split(' ')[1].toLowerCase()
                            === this.help.command;
            this.bot.logger.info(`${this.help.command} : ${check}`);
            return check;
        }
        return false;
    }

    process(msg: Message): Promise<Boolean> {
        const message = new BotMessage(msg);
        const splitData = msg.content.split(' ');
        if(splitData.length > 2){
            const type = splitData[2].toLowerCase() as CommandType;
            this.bot.logger.info(type);
            if(Object.values(CommandType).includes(type)){
                message.setTitle(type);
                const commands = this.bot.commandManager.commands
                                    .filter(value => value.help.type === type);
                commands.forEach(value => {
                    message.addField(value.help.command, value.help.desc);
                });
            }else{
                message.setTitle("No Type");
            }
        }else{
            const helpMap = new Map();
            this.bot.commandManager.commands.forEach((command) => {
                const help = command.help;
                if (helpMap.has(help.type)) {
                    const value: String = helpMap.get(help.type);
                    helpMap.set(help.type.toString(), `${value}, ${help.command}`);
                } else {
                    helpMap.set(help.type.toString(), help.command);
                }
            });
            message.setTitle(this.help.desc);
            helpMap.forEach((value, key, map) => {
                message.addField(key, value);
            });
        }
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
                    message.removeRecvMessage();
                }, 1000 * 10);
                return Promise.resolve(true);
            }, (reject) => {
                return Promise.reject(reject);
            });
    }
}