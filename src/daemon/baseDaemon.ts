import { IBot, ICommand, IMessage, ICommandDescription, CommandType, IDaemon } from "../struct/api";
import { Snowflake } from "discord.js";
import { BotMessage } from "../struct/message";
import { ServiceStatus } from "../struct/api";

export class BaseDaemon implements IDaemon {
    protected _user: Array<Snowflake>;
    protected _timer: NodeJS.Timeout;
    protected _interval: number;
    protected _isDaemon : boolean;
    protected _name : string;

    constructor(){
        this._user = new Array();
        this._isDaemon = false;
        this._name = "";
        this._interval = 1000 * 60;
        this._timer = setInterval(()=>this.execute(), this._interval);
    }

    public get user() : Array<Snowflake> {
        return this._user;
    }
    public get isDaemon() : boolean {
        return this._isDaemon;
    }
    public get name() : string { 
        return this._name;
    }
    public get interval() : number { 
        return this._interval;
    }
    public get timer() : NodeJS.Timeout { 
        return this._timer;
    }

    addUser(arg: Snowflake): void {
        if(!this._user.includes(arg)){
            this._user.push(arg);
        }
    }

    delUser(arg: Snowflake): void {
        if(this._user.includes(arg)){
            delete this._user[this._user.findIndex(value => value === arg)];
        }
    }

    execute() : Promise<boolean>{
        throw new Error("Method not implemented.");
    }

    start(): Promise<Boolean> {
        if(!this._timer.hasRef()){
            this._timer.ref();
            return Promise.resolve(true);
        }
        return Promise.resolve(false);
    }

    stop(): Promise<Boolean> {
        if(this._timer.hasRef()){
            this._timer.unref();
            return Promise.resolve(true);
        }
        return Promise.resolve(false);
    }
}