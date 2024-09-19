import { Bot, Context } from "grammy";
import axios from "axios";
import {
  deleteTelegramChatHistory,
  telegramBotHandler,
  welcomeMessage,
} from "./handlers/telegram.handler";
import { convertTextToAudio } from "./handlers/utils/audio-to-text";
import { FileFlavor, hydrateFiles } from "@grammyjs/files";
import * as fs from "fs/promises";
import { convertOggToWave } from "../utils/ffmpeg";
import { telegramFormat } from "../utils/telegram-format";
type DialoqBaseContext = FileFlavor<Context>;

const groupCommand = process.env.DQ_TG_GROUP_COMMAND || "ask"
const groupCommandRegex = new RegExp(`^\\/${groupCommand}\\s(.*)`);

export default class TelegramBot {
  static get clients() {
    return this._clients.values();
  }

  private static _clients: Map<string, any> = new Map();

  static totolClients() {
    return this._clients.size;
  }

  static async connect(identifier: string, token: string) {
    try {
      if (this._clients.has(identifier)) {
        await this.disconnect(identifier);
      }

      const bot = new Bot<DialoqBaseContext>(token);
      bot.api.config.use(hydrateFiles(bot.token));

      await bot.api.setMyCommands([
        { command: "start", description: "Start the bot" },
        { command: "ping", description: "Ping the bot" },
        { command: "clear", description: "Clear chat history" },
      ]);

      bot.command("start", async (ctx) => {
        await ctx.replyWithChatAction("typing");
        const message = await welcomeMessage(identifier);
        return await ctx.reply(message);
      });
      bot.command("ping", (ctx) => ctx.reply("pong"));
      bot.command("clear", async (ctx) => {
        await ctx.replyWithChatAction("typing");
        if (!ctx?.from?.id) {
          return await ctx.reply("I can't find your user id");
        }
        const response = await deleteTelegramChatHistory(
          identifier,
          ctx.from.id!
        );
        return await ctx.reply(response);
      });
      bot.hears(groupCommandRegex, async (ctx) => {
        try {
          await ctx.replyWithChatAction("typing");
          const user_id = ctx.from.id;
          const [, message] = ctx.match
          if (!message) {
            return await ctx.reply("Please provide a question after /ask");
          }
          const response = await telegramBotHandler(
            identifier,
            message,
            user_id
          );

          if (process.env.DB_TELEGEAM_PARSE_MODE === "normal") {
            return await ctx.reply(response);
          }

          return await ctx.reply(telegramFormat(response),
            {
              parse_mode: "HTML",
            });
        } catch (e) {
          console.log(e)
          return await ctx.reply("Something went wrong")
        }
      });
      bot.on("message:text", async (ctx) => {
        if (ctx.chat.type === "private") {
          await ctx.replyWithChatAction("typing");
          const user_id = ctx.from.id;
          const message = await telegramBotHandler(
            identifier,
            ctx.message.text,
            user_id
          );

          if (process.env.DB_TELEGEAM_PARSE_MODE === "normal") {
            return await ctx.reply(message);
          }

          return await ctx.reply(telegramFormat(message),
            {
              parse_mode: "HTML",
            });
        }
      });

      bot.on("message:voice", async (ctx) => {
        if (ctx.chat.type == "private") {
          try {
            await ctx.replyWithChatAction("typing");

            const file = await ctx.getFile();
            const path = await file.download();

            const audioWav = await convertOggToWave(path);
            const audio = await fs.readFile(audioWav);

            const response = await convertTextToAudio(audio);

            const user_id = ctx.from.id;

            const message = await telegramBotHandler(
              identifier,
              response.text,
              user_id
            );


            if (process.env.DB_TELEGEAM_PARSE_MODE === "normal") {
              return await ctx.reply(message);
            }

            return await ctx.reply(telegramFormat(message),
              {
                parse_mode: "HTML",
              });
          } catch (error) {
            console.log(error);
            return await ctx.reply("Opps! Something went wrong");
          }
        }
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
        `https://api.telegram.org/bot${token}/getMe`
      );
      return response.data.ok;
    } catch (error) {
      return false;
    }
  }
}