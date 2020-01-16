import { IBot, ICommand, IMessage, ICommandDescription } from "../struct/api";
import { Message } from "discord.js";
import { BotMessage } from "../struct/message";
export class Ping implements ICommand {
    init(bot: IBot, dataPath: string): void {
        
    }

    getHelp(): ICommandDescription {
        return { 
            type: "테스트", 
            command : "ping",
            desc: '대충 핑퐁' 
        }
    }
    
    isValid(msg: Message): boolean {
        return msg.content.toLowerCase() == "ping";
    }

    process(msg: Message): Promise<IMessage> {
        const message = new BotMessage(msg.author, true);
        message.setTextOnly("Pong");
        return Promise.resolve(message);
    }
}