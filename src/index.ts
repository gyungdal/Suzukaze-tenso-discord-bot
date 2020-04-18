import { SuzukazeTenso } from "./bot/suzukaze_tenso";
import { ILogger, IConfig } from "./struct/api";
import { join } from "path";
import dotenv from "dotenv";

dotenv.config({ path: join(__dirname, 'bot', '.env.suzukaze_tenso') });

const logger : ILogger =  {
    debug: console.debug,
    error: console.error,
    warn: console.warn,
    info: console.log
};
console.log(process.env.ADMIN_ID);
const admin = process.env.ADMIN_ID?.split(',').filter(value => value.length > 3);
const config : IConfig = {
    id: process.env.DISCORD_CLIENT_ID || "NOP",
    token: process.env.DISCORD_SECRET || "NOP",
    game: "",
    userName: "",
    adminId: admin?.map(value => value.replace(/\"|\[|\]|\'/g, '').trim()) || [""]
};
const tenso = new SuzukazeTenso(logger, config);
tenso.start();