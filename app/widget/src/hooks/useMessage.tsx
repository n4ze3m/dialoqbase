import axios from "axios";
import React from "react";
import { getUrl } from "../utils/getUrl";
import { History, useStoreMessage } from "../store";

export type BotResponse = {
  bot: {
    text: string;
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
  const { history, messages, setHistory, setMessages } = useStoreMessage();
  const [streaming, setStreaming] = React.useState<boolean>(false);

  const notStreamingRequest = async (message: string) => {
    let newMessage = [
      ...messages,
      {
        isBot: false,
        message,
      },
      {
        isBot: true,
        message: "Hold on...",
      },
    ];
    setMessages(newMessage);
    const response = await axios.post(getUrl(), {
      message,
      history,
    });
    const data = response.data as BotResponse;
    newMessage[newMessage.length - 1].message = data.bot.text;
    setMessages(newMessage);
    setHistory(data.history);
  };

  const streamingRequest = async (message: string) => {
    let newMessage = [
      ...messages,
      {
        isBot: false,
        message,
      },
      {
        isBot: true,
        message: "▋",
      },
    ];
    setMessages(newMessage);
    const response = await fetch(`${getUrl()}/stream`, {
      method: "POST",
      body: JSON.stringify({
        message,
        history,
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
          if (count === 0) {
            newMessage[appendingIndex].message = message;
            setMessages(newMessage);
          } else {
            newMessage[appendingIndex].message += message;
            setMessages(newMessage);
          }
          count++;
        } else if (type === "result") {
          const responseData = JSON.parse(message) as BotResponse;
          console.log(responseData);
          newMessage[appendingIndex].message = responseData.bot.text;
          setHistory(responseData.history);
          setMessages(newMessage);
        }
      }
    }
  };

  const onSubmit = async (message: string) => {
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
  };
};
