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
            const check = msg.content.split(' ')[1].toLowerCase()
                === this.help.command;
            this.bot.logger.info(`${this.help.command} : ${check}`);
            return check;
        }
        return false;
    }

    async process(msg: Message): Promise<Boolean> {
        const service = await this.bot.serviceManager.find(this.help.command);
        service.addOrSetArgv(msg.author.id);
        const reply = await msg.reply("Success");
        setTimeout(async ()=>{
            await msg.channel.bulkDelete([msg, reply]);
        }, 1000);
        return Promise.resolve(true);
    }
}