import { RichEmbed, User } from 'discord.js'
import { IMessage } from './api'

export class BotMessage implements IMessage {
    public readonly user: User;
    public readonly isOnlyText: boolean;
    public richText: RichEmbed;
    public text: string;

    constructor(user: User, isOnlyText : boolean = false) {
        this.user = user;
        this.isOnlyText = isOnlyText;
        this.richText = new RichEmbed();
        this.richText.title = undefined;
        this.text = "";
    }

    public isValid(): boolean {
        if(this.isOnlyText){
            return this.text.length == 0;
        }else{
            return this.richText.title != undefined;
        }
    }

    public setTextOnly(text: string): IMessage {
        if (this.richText) { 
            throw new Error('one of rich text methods was used');
        }
        this.text = text;
        return this;
    }

    public addField(name: string, value: string): IMessage {
        this.validateRichText().addField(name, value);
        return this;
    }

    public addBlankField(): IMessage {
        this.validateRichText().addBlankField();
        return this;
    }

    public setColor(color: string | number | [number, number, number]): IMessage {
        this.validateRichText().setColor(color);
        return this;
    }

    public setDescription(description: string): IMessage {
        this.validateRichText().setDescription(description);
        return this;
    }

    public setFooter(text: string, icon?: string): IMessage {
        this.validateRichText().setFooter(text, icon);
        return this;
    }

    public setImage(url: string): IMessage {
        this.validateRichText().setImage(url);
        return this;
    }

    public setThumbnail(url: string): IMessage {
        this.validateRichText().setThumbnail(url);
        return this;
    }

    public setTitle(title: string): IMessage {
        this.validateRichText().setTitle(title);
        return this;
    }

    public setURL(url: string): IMessage {
        this.validateRichText().setURL(url);
        return this;
    }

    private validateRichText(): RichEmbed {
        if (this.isOnlyText) { 
            throw new Error('setTextOnly method was used');
        }
        return this.richText;
    }
}