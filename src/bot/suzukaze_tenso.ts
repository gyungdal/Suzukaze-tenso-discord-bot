import dotenv from 'dotenv';
import { join, dirname } from "path";
import { Client, MessageEmbedImage } from "discord.js";
import { IBot, ICommand, IConfig, IMessage, ILogger, ICommandDescription } from "../struct/api";
import { readdirSync } from "fs";

export class SuzukazeTenso implements IBot {
    private client: Client;
    private config: IConfig;
    private _logger: ILogger;

    _commands: Array<ICommand>;
    botId: string;

    constructor() {
        dotenv.config({ path: join(__dirname, '.env.suzukaze_tenso') });
        this._commands = new Array();
        this.botId = "";
        this.client = new Client();
        this._logger = {
            debug: console.debug,
            error: console.error,
            warn: console.warn,
            info: console.log
        };
        this.config = {
            id : process.env.DISCORD_CLIENT_ID || "NOP",
            token: process.env.DISCORD_SECRET || "NOP",
            commands: [],
            game: "",
            userName: "",
            denyAnswer: process.env.DENY_ANSWER || "NOP"
        };
    }
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


    public start(logger: ILogger = this._logger, config: IConfig = this.config) {
        this._logger = logger;
        this.config = config;
        
        if (!this.config.token) {
            throw new Error('invalid discord token');
        }

        this.client.on('ready', () => {
            this.botId = this.client.user.id;

            this.loadCommands(`${__dirname}/../command`);
            if (this.config.game) {
                this.client.user.setGame(this.config.game);
            }
            if (this.config.userName && this.client.user.username !== this.config.userName) {
                this.client.user.setUsername(this.config.userName);
            }
            this.client.user.setStatus('online');
            this.logger.info('started...');
        });

        this.client.on('message', async (message) => {
            if (!message.author.bot) {
                this.logger.debug(`[${message.author.tag}] ${message.cleanContent}`);
                const command = this.commands
                        .find((command) => command.isValid(message));

                if (command !== undefined) {
                    command.process(message)
                        .then((success) => {
                            this.logger.debug("message process done");
                        }, (reject) => {
                            this.logger.error(reject);
                        })
                }
            }
        });

        this.client.login(this.config.token);

    }

    private loadCommands(commandsPath: string) {
        while (this._commands.length > 0) {
            this._commands.pop();
        }
        this.logger.debug(commandsPath);
        const cmdList = readdirSync(commandsPath);
        this.logger.debug(cmdList);
        if(cmdList.length > 0){
            cmdList.forEach((cmdName)=>{
                cmdName = cmdName.split(".")[0];
                cmdName = `${commandsPath}/${cmdName}`;
                this.logger.debug(cmdName);
                const cmdClass = require(cmdName);
                this.logger.info(cmdClass);
                Object.keys(cmdClass).forEach((key)=>{
                    const command = new cmdClass[key](this.client.user.id) as ICommand;
                    this._commands.push(command);
                    this.logger.info(`command "${cmdName}" loaded...`);
                });
            });
        }
    }
}