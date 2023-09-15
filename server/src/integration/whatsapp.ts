import * as PubSub from "pubsub-js";
import { sendWhatsappMessage } from "../utils/whatsapp";
import {
  clearHistoryWhatsapp,
  whatsappBotHandler,
} from "./handlers/whatsapp.handler";

type Message = {
  text: string;
  identifer: string;
  from: string;
  id: string;
};

export default class WhatsappBot {
  private static _clients = new Map();

  static subscribeToPhoneNumber(phoneNumberId: string) {
    PubSub.subscribe(phoneNumberId, async (id, data: Message) => {
      console.log("incoming message for phone number: ", data);
      const { text, identifer, from, id: hash } = data;
      const accessToken = this.getAccessToken(id);
      if (!accessToken) {
        console.log("no access token found for: ", id);
        return;
      }

      console.log("sending message to whatsapp: ", hash);

      // if text match

      if (text === "/clear") {
        const isOk = await clearHistoryWhatsapp(
          id,
          from,
        );

        if (isOk) {
          await sendWhatsappMessage(
            identifer,
            accessToken,
            {
              to: from,
              text: {
                body: "Chat history cleared",
              },
              type: "text",
              messaging_product: "whatsapp",
              recipient_type: "individual",
            },
          );
        } else {
          await sendWhatsappMessage(
            identifer,
            accessToken,
            {
              to: from,
              text: {
                body: "Opps! Something went wrong",
              },
              type: "text",
              messaging_product: "whatsapp",
              recipient_type: "individual",
            },
          );
        }
        return;
      }

      const generateMessage = await whatsappBotHandler(
        id,
        hash,
        from,
        text,
      );

      if (generateMessage) {
        await sendWhatsappMessage(
          identifer,
          accessToken,
          {
            to: from,
            text: {
              body: generateMessage,
            },
            type: "text",
            messaging_product: "whatsapp",
            recipient_type: "individual",
          },
        );
      } else {
        console.log("no message generated");
      }
    });
  }

  static unsubscribeFromPhoneNumber(phoneNumberId: string) {
    PubSub.unsubscribe(phoneNumberId);
  }

  static publishToPhoneNumber(phoneNumberId: string, msg: any) {
    PubSub.publish(phoneNumberId, msg);
  }

  static totalClients() {
    return this._clients.size;
  }

  static getAccessToken(id: string) {
    return this._clients.get(id)?.accessToken;
  }

  static async connect(id: string, phoneNumberId: string, accessToken: string) {
    this._clients.set(id, { accessToken, phoneNumberId });
    console.log("connected to whatsapp: ", id);
    this.subscribeToPhoneNumber(id);
  }

  static async disconnect(id: string) {
    this._clients.delete(id);
    console.log("disconnected from whatsapp: ", id);
    this.unsubscribeFromPhoneNumber(id);
  }
}
