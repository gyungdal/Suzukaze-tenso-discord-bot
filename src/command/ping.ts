import { IBot, ICommand, IMessage, ICommandDescription } from "../struct/api";
import { Message } from "discord.js";
import { BotMessage } from "../struct/message";
export class Ping implements ICommand {
    public readonly botId : string;
    constructor(botId : string){
        this.botId = botId;
    }

    getHelp(): ICommandDescription {
        return { 
            type: "테스트", 
            command : "ping",
            desc: '대충 핑퐁' 
        }
    }
    
    isValid(msg: Message): boolean {
        if(msg.mentions.users.has(this.botId)){
            return msg.content.split(' ')[1].toLowerCase() == "ping";
        }
        return false;
    }

    process(msg: Message): Promise<Boolean> {
        const message = new BotMessage(msg);
        message.setTitle("Execute");
        message.setDescription("Pong!");
        return message.sendReply()
            .then((resolve)=>{
                setTimeout(()=>{
                    //array인지 체크
                    if(Array.isArray(resolve)){
                        const sendMessages : Message[] = resolve as Message[];
                        sendMessages.forEach(value => {
                            if(value.deletable){
                                value.delete();
                            }
                        });
                    }else{
                        const sendMessage : Message = resolve as Message;
                        if(sendMessage.deletable){
                            sendMessage.delete();
                        }
                    }
                }, 1000 * 10);
                return Promise.resolve(true);
            }, (reject)=>{
                return Promise.reject(reject);
            });
    }
}