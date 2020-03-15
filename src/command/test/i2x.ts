import { IBot, ICommand, IMessage, ICommandDescription, CommandType } from "../../struct/api";
import { Message } from "discord.js";
import { BotMessage } from "../../struct/message";
export class I2X implements ICommand {
    public readonly bot: IBot;
    constructor(bot: IBot) {
        this.bot = bot;
    }

    get help(): ICommandDescription {
        return {
            type: CommandType.TEST,
            command: "i2x",
            desc: '이미지 사이즈 조정'
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

    process(msg: Message): Promise<Boolean> {
        const message = new BotMessage(msg);
        message.setTitle(this.help.desc);
        message.setDescription("Pong!");
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