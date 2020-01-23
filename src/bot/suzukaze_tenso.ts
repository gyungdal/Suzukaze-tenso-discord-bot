import dotenv from 'dotenv';
import { join } from "path";
import { Client } from "discord.js";
import { IBot, ICommand, IConfig, ILogger, IService } from "../struct/api";
import { readdirSync, lstatSync } from "fs";

export class SuzukazeTenso implements IBot {
    
    client: Client;
    config: IConfig;
    logger: ILogger;

    services: Array<IService>;
    commands: Array<ICommand>;

    constructor() {
        dotenv.config({ path: join(__dirname, '.env.suzukaze_tenso') });
        this.commands = new Array();
        this.services = new Array();
        this.client = new Client();
        this.logger = {
            debug: console.debug,
            error: console.error,
            warn: console.warn,
            info: console.log
        };
        this.config = {
            id: process.env.DISCORD_CLIENT_ID || "NOP",
            token: process.env.DISCORD_SECRET || "NOP",
            commands: [],
            game: "",
            userName: "",
            denyAnswer: process.env.DENY_ANSWER || "NOP"
        };
    }

    public start(logger: ILogger = this.logger, config: IConfig = this.config) {
        this.logger = logger;
        this.config = config;

        if (!this.config.token) {
            throw new Error('invalid discord token');
        }

        this.client.on('ready', () => {
            this.config.id = this.client.user.id;

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
                            this.logger.debug(`${command.help.command} Execute Done`);
                        }, (reject) => {
                            this.logger.error(`${command.help.command} Execute Error\n\tㄴ${reject}`);
                            this.client.destroy();
                        });
                }
            }
        });

        this.client.login(this.config.token);

    }

    public addCommandsInDir(dirPath: string): Promise<boolean> {
        try {
            const fileList = readdirSync(dirPath);
            fileList.forEach((cmdName) => {
                const file = lstatSync(join(dirPath, cmdName));
                if (file.isDirectory()) {
                    this.addCommandsInDir(join(dirPath, cmdName));
                } else {
                    cmdName = cmdName.split(".")[0];
                    cmdName = join(dirPath, cmdName);
                    this.logger.debug(cmdName);
                    const cmdClass = require(cmdName);
                    this.logger.info(cmdClass);
                    Object.keys(cmdClass).forEach((key) => {
                        const command = new cmdClass[key](this) as ICommand;
                        this.commands.push(command);
                        this.logger.info(`command "${dirPath}/${cmdName}" loaded...`);
                    });
                }
            });
            return Promise.resolve(true);
        } catch (e) {
            return Promise.reject(e);
        }
    }

    public loadCommands(commandsPath: string): Promise<boolean> {
        while (this.commands.length > 0) {
            this.commands.pop();
        }
        this.logger.debug(commandsPath);
        const cmdList = readdirSync(commandsPath);
        this.logger.debug(cmdList);
        if (cmdList.length > 0) {
            return this.addCommandsInDir(commandsPath);
        } else {
            return Promise.reject("No Commands");
        }
    }
}