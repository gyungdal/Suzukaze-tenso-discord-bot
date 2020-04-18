import dotenv from 'dotenv';
import { join } from "path";
import { Client } from "discord.js";
import { ServiceExecuteResultType, IServiceManager, ICommandManager, IBot, ICommand, IConfig, ILogger, IService } from "../struct/api";
import { readdirSync, lstatSync } from "fs";
import { ServiceManager } from '../manager/serviceManager';
import { CommandManager } from '../manager/commandManager';

export class SuzukazeTenso implements IBot {
    public readonly client: Client;
    public readonly config: IConfig;
    public readonly logger: ILogger;
    public readonly serviceManager: IServiceManager;
    public readonly commandManager: ICommandManager;

    constructor(logger: ILogger, config: IConfig) {
        this.config = config;
        this.logger = logger;
        this.serviceManager = new ServiceManager(this);
        this.commandManager = new CommandManager(this);
        this.client = new Client();
    }

    public start() {
        if (!this.config.token) {
            throw new Error('invalid discord token');
        }

        this.client.on('ready', () => {
            this.config.id = this.client.user.id;
            this.commandManager.load(join(__dirname, '..', 'command'));
            this.serviceManager.load(join(__dirname, '..', 'service'));
            if (this.config.game) {
                this.client.user.setGame(this.config.game);
            }
            if (this.config.userName && this.client.user.username !== this.config.userName) {
                this.client.user.setUsername(this.config.userName);
            }
            this.client.user.setStatus('online');
            this.logger.info('started...');
        });

        this.client.on('message', async message => {
            if (!message.author.bot) {
                return;
            }
            const check = await this.serviceManager.execute(message);
            if(check != ServiceExecuteResultType.CLEAR){
                this.logger.debug(`[${message.author.tag}] ${message.cleanContent}`);
                this.commandManager.execute(message).then((success) => {
                    this.logger.debug(`Execute Done`);
                }, (reject) => {
                    this.logger.error(`Execute Error\n\tㄴ${reject}`);
                });
            }
        });

        this.client.login(this.config.token).then((value)=>{
            this.logger.debug(`[Login Request] ${this.config.token}`);
        }, (reject)=>{
            this.logger.error(`[Login Error!]`);
            this.client.destroy();
        });
    }
}