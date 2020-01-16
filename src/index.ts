import 'dotenv/config';
import { Client } from "discord.js";
import { IBot, ICommand, IMessage, ILogger } from "./struct/api";
import { BotMessage } from "./message";

export class SuzukazeTenso implements IBot {
    private _commands: ICommand[] = [];
    public get commands(): ICommand[] {
        return this._commands;
    }
    private client: Client
    private config: IConfig
    private logger: ILogger
    private botId: string

    public get logger(): ILogger {
        return this.logger;
    }

    public get allUsers() {
        return this.client ? this.client.users.array().filter((i) => i.id !== '1') : []
    }

    public get onlineUsers() {
        return this.allUsers.filter((i) => i.presence.status !== 'offline')
    }


    public start(logger: ILogger, config: IConfig, commandsPath: string, dataPath: string) {
        this.logger = logger
        this.config = config

        this.loadCommands(commandsPath, dataPath)

        if (!this.config.token) { throw new Error('invalid discord token') }

        this.client = new Client()

        this.client.on('ready', () => {
            this.botId = this.client.user.id
            if (this.config.game) {
                this.client.user.setGame(this.config.game)
            }
            if (this.config.username && this.client.user.username !== this.config.username) {
                this.client.user.setUsername(this.config.username)
            }
            this.client.user.setStatus('online')
            this.logger.info('started...')
        })

        this.client.on('message', async (message) => {
            if (message.author.id !== this.botId) {
                const text = message.cleanContent
                this.logger.debug(`[${message.author.tag}] ${text}`)
                for (const cmd of this.commands) {
                    try {
                        if (cmd.isValid(message)) {
                            const answer = new BotMessage(message.author)
                            if (!this.config.idiots || !this.config.idiots.includes(message.author.id)) {
                                await cmd.process(text, answer)
                            } else {
                                if (this.config.idiotAnswer) {
                                    answer.setTextOnly(this.config.idiotAnswer)
                                }
                            }
                            if (answer.isValid()) {
                                message.reply(answer.text || { embed: answer.richText })
                            }
                            break
                        }
                    } catch (ex) {
                        this.logger.error(ex)
                        return
                    }
                }
            }
        })

        this.client.login(this.config.token)
    }

    private loadCommands(commandsPath: string, dataPath: string) {
        if (!this.config.commands || !Array.isArray(this.config.commands) || this.config.commands.length === 0) {
            throw new Error('Invalid / empty commands list')
        }
        for (const cmdName of this.config.commands) {
            const cmdClass = require(`${commandsPath}/${cmdName}`).default
            const command = new cmdClass() as ICommand
            command.init(this, path.resolve(`${dataPath}/${cmdName}`))
            this.commands.push(command)
            this.logger.info(`command "${cmdName}" loaded...`)
        }
    }
}