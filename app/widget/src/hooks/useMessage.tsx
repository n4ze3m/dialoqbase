import axios from "axios";
import { getUrl } from "../utils/getUrl";
import { History, useStoreMessage } from "../store";
import useChatId from "./useChatId";

export type BotResponse = {
  bot: {
    text: string;
    sourceDocuments: any[];
  };
  history: History;
};

const parsesStreamingResponse = (text: string) => {
  // event: chunk or result\ndata:  been or object\n\n
  //   console.log(`text: ${text}`);
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
  } = useStoreMessage();

  const notStreamingRequest = async (message: string) => {
    let newMessage = [
      ...messages,
      {
        isBot: false,
        message,
        sources: [],
      },
      {
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
    newMessage[newMessage.length - 1].sources = data.bot.sourceDocuments;
    localStorage.setItem("DS_MESSAGE", JSON.stringify(newMessage));
    localStorage.setItem("DS_HISTORY", JSON.stringify(data.history));
    setMessages(newMessage);
    setHistory(data.history);
  };

  const streamingRequest = async (message: string) => {
    let newMessage = [
      ...messages,
      {
        isBot: false,
        message,
        sources: [],
      },
      {
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
            newMessage[appendingIndex].message = jsonMessage.message;
            setMessages(newMessage);
            localStorage.setItem("DS_MESSAGE", JSON.stringify(newMessage));
          } else {
            newMessage[appendingIndex].message += jsonMessage.message;
            setMessages(newMessage);
            localStorage.setItem("DS_MESSAGE", JSON.stringify(newMessage));
          }
          count++;
        } else if (type === "result") {
          const responseData = JSON.parse(message) as BotResponse;
          newMessage[appendingIndex].message = responseData.bot.text;
          newMessage[appendingIndex].sources = responseData.bot.sourceDocuments;
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
  };

  const onSubmit = async (message: string) => {
    if (message.trim().length === 0) {
      return;
    }
    if (streaming) {
      await streamingRequest(message);
    } else {
      await notStreamingRequest(message);
    }
  };

  return {
    messages,
    setMessages,
    onSubmit,
    setStreaming,
    streaming,
    setHistory,
    resetChatId,
  };
};
