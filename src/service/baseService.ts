import { IBot, ICommand, IMessage, ICommandDescription, CommandType, IService } from "../struct/api";
import { Message } from "discord.js";
import { BotMessage } from "../struct/message";
import { ServiceStatus } from "../struct/api";

export class BaseService implements IService {
    private _argv : Array<string>;

    public get argv() : Array<string> {
        return this._argv;
    }

    private _status: ServiceStatus;
    public get status() : ServiceStatus{
        return this._status;
    }
    constructor(){
        this._argv = new Array();
        this._status = ServiceStatus.STOP;
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
    execute(): void {
        throw new Error("Method not implemented.");
    }
    start(): ServiceStatus {
        this._status = ServiceStatus.RUNNING;
        return this.status;
    }
    stop(): ServiceStatus {
        this._status = ServiceStatus.STOP;
        return this.status;
    }

    
}