import { readdirSync, lstatSync } from "fs";
import { join } from "path";
import { ICommand, ICommandManager } from "../struct/api";
import { Message } from "discord.js";
import { IBot } from "../struct/api";

export class CommandManager implements ICommandManager {
    public readonly bot: IBot;
    public readonly commands: Array<ICommand>;

    constructor(bot: IBot) {
        this.bot = bot;
        this.commands = new Array();
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
                        const command = new cmdClass[key](this.bot) as ICommand;
                        this.commands.push(command);
                    });
                }
            });
            return Promise.resolve(true);
        } catch (e) {
            return Promise.reject(e);
        }
    }

    public load(path: string): Promise<boolean> {
        while (this.commands.length > 0) {
            this.commands.pop();
        }
        const cmdList = readdirSync(path);
        if (cmdList.length > 0) {
            return this.add(path);
        } else {
            return Promise.reject("No Commands");
        }
    }

    execute(message: Message): Promise<Boolean> {
        const command = this.commands
            .find((command) => command.isValid(message));

        if (command !== undefined) {
            return command.process(message);
        }
        return Promise.reject("No Command");
    }
}