import { IBot, ICommand, IMessage, ICommandDescription, CommandType, IService } from "../struct/api";
import { Message } from "discord.js";
import { BotMessage } from "../struct/message";

export class BaseService implements IService {
    private _argv : Array<string>;
    private _bot: IBot;
    protected _priority: number;
    protected _name : string;

    constructor(bot : IBot){
        this._argv = new Array();
        this._name = "";
        this._priority = 999;
        this._bot = bot;
    }

    public get bot() : IBot { 
        return this._bot;
    }
    public get priority() : number { 
        return this._priority;
    }

    public get name() : string { 
        return this._name;
    }
    public get argv() : Array<string> {
        return this._argv;
    }
    addOrSetArgv(arg: string): void {
        if(!this._argv.includes(arg)){
            this._argv.push(arg);
        }
    }
    removeArgv(arg: string): void {
        if(this._argv.includes(arg)){
            delete this._argv[this._argv.findIndex(value => value === arg)];
        }
    }
    execute(msg : Message) {
        throw new Error("Method not implemented.");
    }
}