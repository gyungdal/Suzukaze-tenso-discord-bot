import { IBot, ICommand, IMessage, ICommandDescription, CommandType } from "../../struct/api";
import { Message } from "discord.js";
import { BotMessage } from "../../struct/message";
import { config } from "dotenv";
import { join } from "path";
export class CommandReload implements ICommand {
    public readonly bot: IBot;
    constructor(bot: IBot) {
        this.bot = bot;
    }

    get help(): ICommandDescription {
        return {
            type: CommandType.UTIL,
            command: "cr",
            desc: "Command Reload"
        }
    }

    isValid(msg: Message): boolean {
        if (msg.mentions.users.has(this.bot.config.id)) {
            if(msg.content.split(' ').length < 2){
                return false;
            }
            const check = msg.content.split(' ').includes(this.help.command);
            const userCheck = this.bot.config.adminId.includes(msg.author.id);
            this.bot.logger.info(`${this.help.command} : ${check}, ${userCheck}`);
            
            return (check && userCheck);
        }
        return false;
    }

    async process(msg: Message): Promise<Boolean> {
        const message = new BotMessage(msg);
        const value = await this.bot.commandManager.load(`${__dirname}/../`);
        message.setTitle(this.help.desc);
        if(value){
            message.setDescription("Success");
        }else{
            message.setDescription("Fail");
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