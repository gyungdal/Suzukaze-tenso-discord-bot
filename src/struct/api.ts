import { Message, RichEmbed } from "discord.js";

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
    id: string;
    token: string;
    commands: string[];
    game: string;
    userName: string;
    denyAnswer: string;
}

export enum CommandType {
    ADMIN = "admin",
    TEST = "test",
    HELP = "help",
    UTIL = "util"
};

export interface ICommandDescription {
    type: CommandType;
    command: string;
    desc: string;
}

export interface IBot {
    config: IConfig;
    readonly commands: Array<ICommand>;
    readonly logger: ILogger;
    readonly allUsers: IUser[];
    readonly onlineUsers: IUser[];
    start(logger: ILogger, config: IConfig): void;
    loadCommands(commandsPath: string): Promise<boolean>;
    addCommandsInDir(dirPath: string): Promise<boolean>;
}
export interface ICommand {
    readonly bot: IBot;
    readonly help: ICommandDescription;
    isValid(msg: Message): boolean;
    process(msg: Message): Promise<Boolean>;
}

export interface IUser {
    id: string;
    username: string;
    discriminator: string;
    tag: string;
}

export enum ServiceStatus{
    RUNNING,
    STOP
};
export interface IService {
    readonly name : string;
    readonly argv : Array<string>;
    readonly status : ServiceStatus;
    addOrSetArgv(arg : string) : void;
    removeArgv(arg : string) : void;
    execute(msg : Message) : void;
    start() : ServiceStatus;
    stop() : ServiceStatus;
}

type MessageColor =
    [number, number, number]
    | number
    | string;

export interface IMessage {
    readonly recvMessage: Message;
    readonly richText: RichEmbed;

    removeRecvMessage(): Promise<Boolean>;
    sendReply(): Promise<(Message | Array<Message>)>;
    sendChannel(): Promise<(Message | Array<Message>)>;
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