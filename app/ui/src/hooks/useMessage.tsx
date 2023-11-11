import { History, useStoreMessage } from "../store";
import api, { baseURL } from "../services/api";
import { useParams } from "react-router-dom";
import { getToken } from "../services/cookie";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";

export type BotResponse = {
  bot: {
    text: string;
    sourceDocuments: any[];
  };
  history: History;
  history_id: string;
};

const parsesStreamingResponse = (text: string) => {
  // event: chunk or result\ndata:  been or object\n\n
  //   console.log(`text: ${text}`);
  const REGEX = /event: (.+)\ndata: (.+)/g;
  const matches = text.matchAll(REGEX);
  // console.log(text)
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
  const {
    history,
    messages,
    setHistory,
    setMessages,
    setStreaming,
    streaming,
    setIsFirstMessage,
    historyId,
    setHistoryId,
    isLoading,
    setIsLoading,
    isProcessing,
    setIsProcessing,
  } = useStoreMessage();

  const param = useParams<{ id: string; history_id?: string }>();
  const abortControllerRef = React.useRef<AbortController | null>(null);

  const client = useQueryClient();

  const getUrl = () => {
    return `bot/playground/${param.id}`;
  };

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
    const response = await api.post(`/${getUrl()}`, {
      message,
      history,
    });
    const data = response.data as BotResponse;
    newMessage[newMessage.length - 1].message = data.bot.text;
    newMessage[newMessage.length - 1].sources = data.bot.sourceDocuments;
    setHistoryId(data.history_id);
    setMessages(newMessage);
    setHistory(data.history);
  };

  const streamingRequest = async (message: string) => {
    abortControllerRef.current = new AbortController();

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
    const response = await fetch(`${baseURL}/${getUrl()}/stream`, {
      method: "POST",
      body: JSON.stringify({
        message,
        history,
        history_id: historyId,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      signal: abortControllerRef.current.signal,
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
            setIsProcessing(true);
            newMessage[appendingIndex].message = jsonMessage.message + "▋";
            setMessages(newMessage);
          } else {
            newMessage[appendingIndex].message =
              newMessage[appendingIndex].message.slice(0, -1) +
              jsonMessage.message +
              "▋";
            setMessages(newMessage);
          }
          count++;
        } else if (type === "result") {
          const responseData = JSON.parse(message) as BotResponse;
          newMessage[appendingIndex].message = responseData.bot.text;
          newMessage[appendingIndex].sources = responseData.bot.sourceDocuments;
          setHistoryId(responseData.history_id);
          setHistory(responseData.history);
          setMessages(newMessage);
          setIsProcessing(false);
          reader.releaseLock();
          break;
        }
      }
    }
    reader.releaseLock();
  };

  const onSubmit = async (message: string) => {
    if (streaming) {
      await streamingRequest(message);
    } else {
      await notStreamingRequest(message);
    }

    client.invalidateQueries([
      "getBotPlaygroundHistory",
      param.id,
      param.history_id,
    ]);
  };

  const stopStreamingRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  return {
    messages,
    setMessages,
    onSubmit,
    setStreaming,
    streaming,
    setHistory,
    historyId,
    setHistoryId,
    setIsFirstMessage,
    isLoading,
    setIsLoading,
    isProcessing,
    stopStreamingRequest,
  };
};
