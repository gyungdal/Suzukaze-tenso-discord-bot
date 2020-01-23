import { BaseService } from "./baseService";
import { Message } from "discord.js";

export class Ban extends BaseService {
    constructor(){
        super();
        this._name = "ban";
    }

    execute(msg : Message) : Promise<boolean> {
        if(this.argv.includes(msg.author.id)){
            if(msg.deletable){
                msg.reply("너 싫대").then((success)=>{
                    msg.delete();
                    setTimeout(()=>{
                        if(Array.isArray(success)){
                            success.forEach((send)=>{
                                if(send.deletable){
                                    send.delete();
                                }
                            })
                        }else{
                            if(success.deletable){
                                success.delete();
                            }
                        }
                    }, 1000);
                });
                return Promise.resolve(true);
            }else{
                return Promise.reject("can't remove message");
            }
        }
        return Promise.reject("not used");
    }
}