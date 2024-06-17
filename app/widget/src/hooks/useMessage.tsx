import axios from "axios";
import { getUrl } from "../utils/getUrl";
import { History, useStoreMessage } from "../store";
import useChatId from "./useChatId";
import { generateUUID } from "../utils/uuid";
import { notification } from "antd";

export type BotResponse = {
  bot: {
    chat_id: string;
    text: string;
    sourceDocuments: any[];
  };
  history: History;
};

const parsesStreamingResponse = (text: string) => {
  const REGEX = /event: (.+)\ndata: (.+)/g;
  const matches = text.matchAll(REGEX);
  const result = [];
  for (const match of matches) {
    const type = match[1];
    const message = match[2];
    result.push({
      type,
      message,
    });
  }

  return result;
};

export const useMessage = () => {
  const { chatId, resetChatId } = useChatId();
  const {
    history,
    messages,
    setHistory,
    setMessages,
    setStreaming,
    streaming,
    processing,
    setProcessing,
  } = useStoreMessage();

  const notStreamingRequest = async (message: string) => {
    try {
      let newMessage = [
        ...messages,
        {
          id: generateUUID(),
          isBot: false,
          message,
          sources: [],
        },
        {
          id: "temp-id",
          isBot: true,
          message: "Hold on...",
          sources: [],
        },
      ];
      setMessages(newMessage);
      const response = await axios.post(getUrl(), {
        message,
        history,
        history_id: chatId,
      });
      const data = response.data as BotResponse;
      newMessage[newMessage.length - 1].message = data.bot.text;
      newMessage[newMessage.length - 1].id = data.bot.chat_id;
      newMessage[newMessage.length - 1].sources = data.bot.sourceDocuments;
      localStorage.setItem("DS_MESSAGE", JSON.stringify(newMessage));
      localStorage.setItem("DS_HISTORY", JSON.stringify(data.history));
      setMessages(newMessage);
      setHistory(data.history);
    } catch (e) {
      notification.error({
        message:
          "There was an error processing your request. Please try again.",
      });
      console.error(e);
    }
  };

  const streamingRequest = async (message: string) => {
    try {
      let newMessage = [
        ...messages,
        {
          id: generateUUID(),
          isBot: false,
          message,
          sources: [],
        },
        {
          id: "temp-id",
          isBot: true,
          message: "▋",
          sources: [],
        },
      ];
      setMessages(newMessage);
      const response = await fetch(`${getUrl()}/stream`, {
        method: "POST",
        body: JSON.stringify({
          message,
          history,
          history_id: chatId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch server side streaming");
      }

      const reader = response.body?.getReader();

      if (!reader) {
        throw new Error("Failed to read server side streaming");
      }

      const decoder = new TextDecoder("utf-8");

      const appendingIndex = newMessage.length - 1;
      let count = 0;

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          break;
        }

        const text = decoder.decode(value);

        const p = parsesStreamingResponse(text);

        if (p.length === 0) {
          continue;
        }

        for (const { type, message } of p) {
          if (type === "chunk") {
            const jsonMessage = JSON.parse(message);
            if (count === 0) {
              newMessage[appendingIndex].message = jsonMessage.message + "▋";
              setMessages(newMessage);
              localStorage.setItem("DS_MESSAGE", JSON.stringify(newMessage));
            } else {
              newMessage[appendingIndex].message =
                newMessage[appendingIndex].message.slice(0, -1) +
                jsonMessage.message +
                "▋";
              setMessages(newMessage);
              localStorage.setItem("DS_MESSAGE", JSON.stringify(newMessage));
            }
            count++;
          } else if (type === "result") {
            const responseData = JSON.parse(message) as BotResponse;
            newMessage[appendingIndex].message = responseData.bot.text;
            newMessage[appendingIndex].sources =
              responseData.bot.sourceDocuments;
            newMessage[appendingIndex].id = responseData.bot.chat_id;
            localStorage.setItem("DS_MESSAGE", JSON.stringify(newMessage));
            localStorage.setItem(
              "DS_HISTORY",
              JSON.stringify(responseData.history)
            );
            setHistory(responseData.history);
            setMessages(newMessage);
          }
        }
      }
    } catch (e) {
      notification.error({
        message: "Failed to fetch server side streaming",
      });
      console.error(e);
    }
  };

  const onSubmit = async (message: string) => {
    if (message.trim().length === 0) {
      return;
    }
    setProcessing(true);
    if (streaming) {
      await streamingRequest(message);
    } else {
      await notStreamingRequest(message);
    }
    setProcessing(false);
  };

  return {
    messages,
    setMessages,
    onSubmit,
    setStreaming,
    streaming,
    setHistory,
    resetChatId,
    processing,
  };
};
