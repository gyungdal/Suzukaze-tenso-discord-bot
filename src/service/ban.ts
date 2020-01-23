import { BaseService } from "./baseService";
import { Message } from "discord.js";

export class Ban extends BaseService {
    constructor(){
        super();
        this._name = "ban";
    }

    execute(msg : Message) : void {
        if(this.argv.includes(msg.author.id)){
            if(msg.deletable){
                msg.delete();
            }
        }
    }
}