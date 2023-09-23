import { App, LogLevel } from "@slack/bolt";

export default class SlackBot {
  static get clients() {
    return this._clients.values();
  }

  private static _clients: Map<string, App> = new Map();

  static totolClients() {
    return this._clients.size;
  }

  static async disconnect(identifier: string) {
    this._clients.get(identifier)?.stop();
    this._clients.delete(identifier);
  }

  static async connect(
    identifier: string,
    token: string,
    signingSecret: string,
    appToken: string,
  ) {
    if (this._clients.has(identifier)) {
      await this.disconnect(identifier);
    }

    const app = new App({
      token,
      signingSecret,
      socketMode: true,
      appToken,
      logLevel: LogLevel.DEBUG,
      developerMode: true,
    });

            
        
    app.message(/^q\?/,  async ({ message, say }) => {
        try {
            console.log("hey", message)
          say("Hello Human!");
        } catch (error) {
            console.log("err")
          console.error(error);
        }
    });

    await app.start(43432);

    this._clients.set(identifier, app);
  }
}
