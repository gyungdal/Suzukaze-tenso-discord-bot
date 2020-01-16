import { Message, User, RichEmbed } from "discord.js";

export interface ILoggerMethod {
    (msg: string, ...args: any[]): void
    (obj: object, msg?: string, ...args: any[]): void
}

export interface ILogger {
    debug: ILoggerMethod
    info: ILoggerMethod
    warn: ILoggerMethod
    error: ILoggerMethod
}

export interface IConfig {
    token : string;
    commands : string[];
    game : string;
    userName : string;
    denyUsers : string[];
    denyAnswer : string;
}

export interface ICommandDescription {
    type : string;
    command : string;
    desc : string;
}

export interface IBot {
    botId : string;
    readonly commands: ICommand[];
    readonly logger: ILogger;
    readonly allUsers: IUser[];
    readonly onlineUsers: IUser[];
    start(logger: ILogger, config: IConfig, commandsPath: string, dataPath: string): void;
}

export interface ICommand {
    getHelp(): ICommandDescription;
    init(bot: IBot, dataPath: string): void;
    isValid(msg: Message): boolean;
    process(msg: Message): Promise<IMessage>;
}

export interface IUser {
    id: string;
    username: string;
    discriminator: string;
    tag: string;
}

type MessageColor =
    [number, number, number]
    | number
    | string;

export interface IMessage {
    readonly user: User;
    readonly isOnlyText : boolean;
    richText: RichEmbed;
    text: string;

    setTextOnly(text: string): IMessage;
    addField(name: string, value: string): IMessage;
    addBlankField(): IMessage;
    setColor(color: MessageColor): IMessage;
    setDescription(description: string): IMessage;
    setFooter(text: string, icon?: string): IMessage;
    setImage(url: string): IMessage;
    setThumbnail(url: string): IMessage;
    setTitle(title: string): IMessage;
    setURL(url: string): IMessage;
}

//https://github.com/Leopotam/discord-bot/blob/master/src/api.ts 참고