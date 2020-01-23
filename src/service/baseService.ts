import { IBot, ICommand, IMessage, ICommandDescription, CommandType, IService } from "../struct/api";
import { Message } from "discord.js";
import { BotMessage } from "../struct/message";
import { ServiceStatus } from "../struct/api";

export class BaseService implements IService {
    protected _name : string;
    private _argv : Array<string>;
    private _status: ServiceStatus;

    constructor(){
        this._argv = new Array();
        this._status = ServiceStatus.STOP;
        this._name = "";
    }

    public get name() : string { 
        return this._name;
    }
    public get argv() : Array<string> {
        return this._argv;
    }
    public get status() : ServiceStatus{
        return this._status;
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
    execute(msg : Message) : void{
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