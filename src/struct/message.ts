import { RichEmbed, Message } from 'discord.js'
import { IMessage } from './api'

export class BotMessage implements IMessage {
    public readonly recvMessage: Message;
    public richText: RichEmbed;

    constructor(recvMessage: Message) {
        this.recvMessage = recvMessage;
        this.richText = new RichEmbed();
        this.richText.title = undefined;
    }

    public sendReply(): Promise<(Message|Array<Message>)> {
        return this.recvMessage.reply({embed : this.richText});
    }
    public sendChannel(): Promise<(Message|Array<Message>)> {
        return this.recvMessage.channel.send({embed : this.richText});
    }

    public isValid(): boolean {
        return this.richText.title != undefined;
    }

    public addField(name: string, value: string): IMessage {
        this.richText.addField(name, value);
        return this;
    }

    public addBlankField(): IMessage {
        this.richText.addBlankField();
        return this;
    }

    public setColor(color: string | number | [number, number, number]): IMessage {
        this.richText.setColor(color);
        return this;
    }

    public setDescription(description: string): IMessage {
        this.richText.setDescription(description);
        return this;
    }

    public setFooter(text: string, icon?: string): IMessage {
        this.richText.setFooter(text, icon);
        return this;
    }

    public setImage(url: string): IMessage {
        this.richText.setImage(url);
        return this;
    }

    public setThumbnail(url: string): IMessage {
        this.richText.setThumbnail(url);
        return this;
    }

    public setTitle(title: string): IMessage {
        this.richText.setTitle(title);
        return this;
    }

    public setURL(url: string): IMessage {
        this.richText.setURL(url);
        return this;
    }
}