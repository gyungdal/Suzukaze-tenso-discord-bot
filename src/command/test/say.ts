import { IBot, ICommand, IMessage, ICommandDescription, CommandType } from "../../struct/api";
import { Message } from "discord.js";
import { BotMessage } from "../../struct/message";
import { platform, release, freemem, loadavg, cpus, arch} from "os";

export class SystemLoad implements ICommand {
    public readonly bot: IBot;
    constructor(bot: IBot) {
        this.bot = bot;
    }

    get help(): ICommandDescription {
        return {
            type: CommandType.TEST,
            command: "say",
            desc: 'Say'
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
        const service = await this.bot.serviceManager.find(this.help.command);
        const message = new BotMessage(msg);
        message.setTitle(this.help.desc);
        
        if(service.argv.includes(msg.author.id)){
            service.removeArgv(msg.author.id);
            message.addField("status", "disable");
        }else{
            service.addOrSetArgv(msg.author.id);
            message.addField("status", "enable");
        }
        const reply = await message.sendReply();
        setTimeout(async ()=>{
            msg.channel.bulkDelete([msg, reply]);
        }, 1000);
        return Promise.resolve(true);
    }
}