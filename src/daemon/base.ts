import { IBot, ICommand, IMessage, ICommandDescription, CommandType, IDaemon } from "../struct/api";
import { Snowflake, Client } from "discord.js";
import { BotMessage } from "../struct/message";
import { ServiceStatus } from "../struct/api";

export class BaseDaemon implements IDaemon {
    protected _id: Array<Snowflake>;
    protected _interval: number;
    protected _name : string;

    constructor(){
        this._id = new Array();
        this._name = "";
        this._interval = 1000 * 60;
    }

    public get id() : Array<Snowflake> {
        return this._id;
    }
    public get name() : string { 
        return this._name;
    }
    public get interval() : number { 
        return this._interval;
    }
    addId(arg: Snowflake): void {
        if(!this._id.includes(arg)){
            this._id.push(arg);
        }
    }

    delId(arg: Snowflake): void {
        if(this._id.includes(arg)){
            delete this._id[this._id.findIndex(value => value === arg)];
        }
    }

    execute(client : Client) : Promise<boolean>{
        throw new Error("Method not implemented.");
    }
}