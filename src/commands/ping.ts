import { IBot, IBotCommand, IBotMessage, IBotCommandHelp } from "../api";
import { Message } from "discord.js";
export class Ping implements IBotCommand {
    getHelp(): IBotCommandHelp {
        return { 
            caption: '테스트', 
            description: '대충 핑퐁' 
        }
    }
    init(bot: IBot, dataPath: string): void {

    }

    isValid(msg: Message): boolean {
        return msg.content.toLowerCase() == "ping";
    }

    async process(msg: string, answer: IBotMessage): Promise<void> {
        answer.setTextOnly("Pong");
    }


}