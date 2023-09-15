import axios, { AxiosError } from "axios";

// https://developers.facebook.com/docs/whatsapp/cloud-api/guides/send-messages
interface OfficialSendMessageResult {
  messaging_product: "whatsapp";
  contacts: {
    input: string;
    wa_id: string;
  }[];
  messages: {
    id: string;
  }[];
}
interface Message {
  messaging_product: "whatsapp";
  recipient_type: "individual";
  to: string;
}
export interface Text {
  body: string;
  preview_url?: boolean;
}

export interface TextMessage extends Message {
  type: "text";
  text: Text;
}

export interface SendMessageResult {
  messageId: string;
  phoneNumber: string;
  whatsappId: string;
}

export const sendWhatsappMessage = async (
  fromPhoneNumberId: string,
  accessToken: string,
  // version: string = "v18.0",
  data: TextMessage,
) => {
  try {
    const { data: rawResult } = await axios({
      method: "post",
      url: `https://graph.facebook.com/v18.0/${fromPhoneNumberId}/messages`,
      data,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const result = rawResult as OfficialSendMessageResult;

    return {
      messageId: result.messages?.[0]?.id,
      phoneNumber: result.contacts?.[0]?.input,
      whatsappId: result.contacts?.[0]?.wa_id,
    };
  } catch (err: unknown) {
    if ((err as any).response) {
      throw (err as AxiosError)?.response?.data;
    } else if (err instanceof Error) {
      throw (err as Error).message;
    } else {
      throw err;
    }
  }
};
