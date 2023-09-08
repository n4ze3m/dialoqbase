import { Bot } from "grammy";
import axios from "axios";
import { telegramBotHandler } from "./handlers/telegram.handler";

export default class TelegramBot {
  static get clients() {
    return this._clients.values();
  }

  private static _clients: Map<string, Bot> = new Map();

  static totolClients() {
    return this._clients.size;
  }

  static async connect(identifier: string, token: string) {
    try {
      if (this._clients.has(identifier)) {
        await this.disconnect(identifier);
      }

      const bot = new Bot(token);
      await bot.api.setMyCommands([
        { command: "start", description: "Start the bot" },
        { command: "ping", description: "Ping the bot" },
      ]);

      bot.command("start", (ctx) => ctx.reply("Hey, How can I assist you?"));
      bot.command("ping", (ctx) => ctx.reply("pong"));
      bot.on("message:text", async (ctx) => {
        // check it's a group chat
        if (ctx.chat.type !== "private") {
          return ctx.reply("I can only work in private chats.");
        }
        await ctx.replyWithChatAction(
          "typing",
        );
        //  set messaging type
        const user_id = ctx.from.id;
        const message = await telegramBotHandler(
          identifier,
          ctx.message.text,
          user_id,
        );

        return await ctx.reply(message);
      });
      bot.start();
      bot.catch((err) => console.log(`${identifier} error: ${err}`));
      this._clients.set(identifier, bot);
    } catch (error) {
      console.log("[TelegramBot] error: ", error);
    }
  }

  static async isConnect(identifier: string) {
    return this._clients.has(identifier);
  }

  static async disconnect(identifier: string) {
    this._clients.get(identifier)?.stop();
    this._clients.delete(identifier);
  }

  static async isValidate(token: string) {
    try {
      const response = await axios.get(
        `https://api.telegram.org/bot${token}/getMe`,
      );
      return response.data.ok;
    } catch (error) {
      return false;
    }
  }
}
