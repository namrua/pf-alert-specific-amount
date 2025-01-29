import TelegramBot from 'node-telegram-bot-api';

//z99
// let token = '1806320860:AAHBv2OCvs4yT_XzjR32shnf4UtiCD9U_YE';
//pf-twitter-bot
let token = '7868476486:AAHsm3zCPWXRimE39DgUMhB3KxHIyjTH9Sg';

//namzua
// let token = '8120706881:AAFU5c5sQfJiuh7Na9SnrXjug2hIz29BywE';
const bot = new TelegramBot(token, { polling: false });

export default class TelegramMessageSender {
    public static async sendMessage(chatId: number, message: string, keyboard: any) {
        const messageToReply = await bot.sendMessage(chatId, message, { parse_mode: 'HTML', disable_web_page_preview: true, reply_markup: keyboard });
        return messageToReply.message_id;
    }

    public static async sendMessageWithPhoto(chatId: number, message: string, photo: string, keyboard: any) {
        await bot.sendPhoto(chatId, photo, { caption: message, parse_mode: 'HTML', reply_markup: keyboard });
    }

    public static async sendMessageReply(replyToMessageId: number, chatId: number, message: string, keyboard: any) {
        if (keyboard)
            await bot.sendMessage(chatId, message, { parse_mode: 'HTML', disable_web_page_preview: true, reply_markup: keyboard, reply_to_message_id: replyToMessageId });
        else
            await bot.sendMessage(chatId, message, { parse_mode: 'HTML', disable_web_page_preview: true, reply_to_message_id: replyToMessageId });
    }

    public static async updateMessage(chatId: number, messageId: number, message: string, keyboard: any) {
        if (keyboard)
            await bot.editMessageText(message, { chat_id: chatId, message_id: messageId, parse_mode: 'HTML', disable_web_page_preview: true, reply_markup: keyboard });
        else
            await bot.editMessageText(message, { chat_id: chatId, message_id: messageId, parse_mode: 'HTML', disable_web_page_preview: true });
    }

    public static async sendPhotoReplyMessage(replyToMessageId: number, chatId: number, photo: Buffer, message: string, keyboard: any) {
        if (keyboard)
            await bot.sendPhoto(chatId, photo, { caption: message, parse_mode: 'HTML', reply_markup: keyboard, reply_to_message_id: replyToMessageId });
        else
            await bot.sendPhoto(chatId, photo, { caption: message, parse_mode: 'HTML', reply_to_message_id: replyToMessageId });
    }
}