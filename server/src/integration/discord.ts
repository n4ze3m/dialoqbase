import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  EmbedBuilder,
  GatewayIntentBits,
  REST,
  Routes,
} from "discord.js";
import {
  clearDiscordChatHistory,
  discordBotHandler,
} from "./handlers/discord.handler";

function url_to_label(
  url: string,
  alternative: string,
  smart_label: boolean
): string {
  // Reduce URLs to a representative label,
  // as Discord at most allows 80 characters in their labels
  // https://discord.com/developers/docs/interactions/message-components

  if (smart_label) {
    let label = url;

    if (!label?.includes("?")) {
      // "https://en.wikipedia.org/wiki/Linux_kernel" => "Linux kernel"
      label = decodeURI(label.split("/").slice(-1)[0].replaceAll("_", " "));
    } else {
      // "https://en.wikipedia.org/w/index.php?title=Linux_kernel" => "Linux kernel"
      label = decodeURI(label.split("=").slice(-1)[0].replaceAll("_", " "));
    }

    if (label.length <= 80) {
      return label;
    }
  }

  // Always return alternative in last case
  return alternative;
}

export default class DiscordBot {
  static get clients() {
    return this._clients.values();
  }

  private static _clients: Map<string, Client> = new Map();

  static totolClients() {
    return this._clients.size;
  }

  static async connect(
    identifier: string,
    token: string,
    command: string = "hey",
    slashCommandsDescription: string = "Say hey to the bot",
    showSources: boolean | string = false,
    smartLabel: boolean | string = false
  ) {
    try {
      if (this._clients.has(identifier)) {
        await this.disconnect(identifier);
      }
      const bot = new Client({ intents: [GatewayIntentBits.Guilds] });
      showSources = !!showSources && showSources != "false";
      const smartLabelBool = !!smartLabel && smartLabel != "false";

      this._clients.set(identifier, bot);

      let slashCommands = command.replace(/[^a-zA-Z0-9]/g, "");

      bot.on("ready", async () => {
        console.log(`Logged in as ${bot.user?.tag}!`);
        const clientId = bot.user?.id;
        if (clientId) {
          await this.setCommand(
            token,
            clientId,
            slashCommands.replace(/[^a-zA-Z0-9]/g, ""),
            slashCommandsDescription
          );
        }
      });

      bot.on("interactionCreate", async (interaction) => {
        console.log(interaction);
        if (!interaction.isCommand()) return;

        if (interaction.commandName === slashCommands) {
          if (!interaction.guildId) {
            await interaction.reply("Bot only works in channels");
            return;
          }
          const userMessage = interaction.options.get("message");
          const message = userMessage?.value;
          if (!message) {
            await interaction.reply("Message is required");
            return;
          }
          const channel_id = interaction.channelId;
          const user_id = interaction.user.id;
          const guild_id = interaction.guildId;
          const chat_id = `${guild_id}-${channel_id}-${user_id}`;

          await interaction.reply({
            content: "_Hold on, I'm thinking 🤔..._",
            fetchReply: false,
          });

          const bot_response = await discordBotHandler(
            identifier,
            message.toString(),
            chat_id
          );

          const unique_button_sources: Array<string> = Array.from(
            // Convert to Set so we only get unique sources
            // i.e. sources made from the same source will be "merged"
            new Set(
              bot_response?.sourceDocuments?.map(
                (d: { metadata: { source?: string; path?: string } }): string =>
                  d.metadata?.source || d.metadata?.path || ""
              )
            )
          );

          await interaction
            .editReply({
              content: "",
              embeds: [
                new EmbedBuilder({
                  title: message.toString(),
                  description: bot_response?.text,
                }),
              ],
              components:
                unique_button_sources.length > 0
                  ? showSources
                    ? [
                        new ActionRowBuilder<ButtonBuilder>({
                          components: unique_button_sources.map(
                            (url: string, i: number): ButtonBuilder =>
                              new ButtonBuilder({
                                style: ButtonStyle.Link,
                                label: url_to_label(
                                  url,
                                  `Source ${(i + 1).toString()}`,
                                  smartLabelBool
                                ),
                                url: url,
                              })
                          ),
                        }),
                      ]
                    : []
                  : [],
            })
            .catch((err: any) => console.log(err));
        }

        if (interaction.commandName === "clear") {
          if (!interaction.guildId) {
            await interaction.reply("Bot only works in channels");
            return;
          }
          const channel_id = interaction.channelId;
          const user_id = interaction.user.id;
          const guild_id = interaction.guildId;

          const chat_id = `${guild_id}-${channel_id}-${user_id}`;

          const reply = await interaction.reply({
            content: "_Deleting chat history..._",
          });

          const bot_response = await clearDiscordChatHistory(
            identifier,
            chat_id
          );

          await reply.edit(bot_response);
        }
      });

      bot.login(token);
    } catch (error) {
      console.log("[DiscordBot] Error", error);
    }
  }

  static async isConnect(identifier: string) {
    return this._clients.has(identifier);
  }

  static async disconnect(identifier: string) {
    this._clients.get(identifier)?.destroy();
    this._clients.delete(identifier);
  }

  static async isValidate(token: string) {
    try {
      const rest = new REST({ version: "10" }).setToken(token);
      await rest.get(Routes.oauth2CurrentApplication());
      return true;
    } catch (error) {
      return false;
    }
  }

  static async setCommand(
    token: string,
    clientId: string,
    slashCommands: string = "hey",
    slashCommandsDescription: string = "Say hey to the bot"
  ) {
    try {
      const rest = new REST({ version: "10" }).setToken(token);
      await rest.put(Routes.applicationCommands(clientId), {
        body: [
          {
            name: slashCommands,
            description: slashCommandsDescription,
            options: [
              {
                name: "message",
                description: "Message to send",
                type: 3,
                required: true,
              },
            ],
          },
          {
            name: "clear",
            description: "Clear bot chat memory",
            options: [],
          },
        ],
      });
      return "ok";
    } catch (error) {
      return null;
    }
  }
}
