import 'dotenv/config';
import { Client } from "discord.js";
import { IBot, ICommand, IConfig, IMessage, ILogger } from "../api";
import { BotMessage } from "../message";
import { resolve } from "path";

export class SuzukazeTenso implements IBot {
    private _commands: ICommand[] = [];
    private client: Client
    private config: IConfig
    private _logger: ILogger
    private botId: string
    public get commands(): ICommand[] {
        return this._commands;
    }

    public get logger(): ILogger {
        return this._logger;
    }

    public get allUsers() {
        return this.client
        ? this.client.users.array().filter((i) => i.id !== '1') 
        : [];
    }

    public get onlineUsers() {
        return this.allUsers.filter((i) => i.presence.status !== 'offline');
    }


    public start(logger: ILogger, config: IConfig, commandsPath: string, dataPath: string) {
        this._logger = logger;
        this.config = config;

        this.loadCommands(commandsPath, dataPath);

        if (!this.config.token) { 
            throw new Error('invalid discord token');
        }

        this.client = new Client();

        this.client.on('ready', () => {
            this.botId = this.client.user.id;
            if (this.config.game) {
                this.client.user.setGame(this.config.game);
            }
            if (this.config.userName && this.client.user.username !== this.config.userName) {
                this.client.user.setUsername(this.config.userName);
            }
            this.client.user.setStatus('online');
            this.logger.info('started...');
        })

        this.client.on('message', async (message) => {
            if (message.author.id !== this.botId) {
                const text = message.cleanContent;
                this.logger.debug(`[${message.author.tag}] ${text}`);
                for (const cmd of this.commands) {
                    try {
                        if (cmd.isValid(message)) {
                            const answer = new BotMessage(message.author);
                            if (!this.config.denyUsers || !this.config.denyUsers.includes(message.author.id)) {
                                await cmd.process(text, answer);
                            } else {
                                if (this.config.denyAnswer) {
                                    answer.setTextOnly(this.config.denyAnswer);
                                }
                            }
                            if (answer.isValid()) {
                                message.reply(answer.text || { embed: answer.richText });
                            }
                            break;
                        }
                    } catch (ex) {
                        this.logger.error(ex);
                        return;
                    }
                }
            }
        })

        this.client.login(this.config.token);
    }

    private loadCommands(commandsPath: string, dataPath: string) {
        if (!this.config.commands || !Array.isArray(this.config.commands) || this.config.commands.length === 0) {
            throw new Error('Invalid / empty commands list');
        }
        for (const cmdName of this.config.commands) {
            const cmdClass = require(`${commandsPath}/${cmdName}`).default;
            const command = new cmdClass() as ICommand;
            command.init(this, resolve(`${dataPath}/${cmdName}`));
            this.commands.push(command);
            this.logger.info(`command "${cmdName}" loaded...`);
        }
    }
}