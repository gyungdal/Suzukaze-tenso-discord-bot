import { readdirSync, lstatSync } from "fs";
import { join } from "path";
import { IService, IServiceManager } from "../struct/api";
import { IBot } from "../struct/api";
import { ServiceExecuteResultType } from "../struct/api";
import { Message } from "discord.js";
import { isUndefined } from "util";

export class ServiceManager implements IServiceManager {
    public readonly bot: IBot;
    public readonly service : Array<IService>;

    constructor(bot: IBot) {
        this.bot = bot;
        this.service = new Array();
    }

    public find(name : string): Promise<IService>{
        const service = this.service.find(service => service.name === name);
        if(service === undefined){
            return Promise.reject("Not found s ervice");
        }
        return Promise.resolve(service);
    }

    public add(dirPath: string): Promise<boolean> {
        try {
            const fileList = readdirSync(dirPath);
            fileList.forEach((cmdName) => {
                const file = lstatSync(join(dirPath, cmdName));
                if (file.isDirectory()) {
                    this.add(join(dirPath, cmdName));
                } else {
                    cmdName = cmdName.split(".")[0];
                    cmdName = join(dirPath, cmdName);
                    const cmdClass = require(cmdName);
                    Object.keys(cmdClass).forEach((key) => {
                        const service = new cmdClass[key](this.bot) as IService;
                        this.service.push(service);
                    });
                }
            });
            this.service.sort((a, b) => a.priority - b.priority);
            return Promise.resolve(true);
        } catch (e) {
            return Promise.reject(e);
        }
    }

    public load(path: string): Promise<boolean> {
        while (this.service.length > 0) {
            this.service.pop();
        }
        const cmdList = readdirSync(path);
        if (cmdList.length > 0) {
            return this.add(path);
        } else {
            return Promise.reject("No Commands");
        }
    }
    
    async execute(msg: Message): Promise<ServiceExecuteResultType>{
        const serv = this.service.find(service => service.isValid(msg));
        if(!isUndefined(serv)){
            return serv.execute(msg);
        }
        else
            return Promise.resolve(ServiceExecuteResultType.NEED_EXECUTE_COMMAND);
          
    }
}