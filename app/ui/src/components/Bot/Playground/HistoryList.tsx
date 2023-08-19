import { useQuery } from "@tanstack/react-query";
import { PlaygroundHistoryCard } from "./HistoryCard";
import { useParams } from "react-router-dom";
import api from "../../../services/api";
import { BotPlaygroundHistory } from "./types";
import React from "react";
import { useMessage } from "../../../hooks/useMessage";
import { Empty } from "antd";

export const PlaygroundHistoryList = () => {
  const params = useParams<{ id: string; history_id?: string }>();
  const {
    setMessages,
    setHistory,
    setStreaming,
    setHistoryId,
    setIsLoading,
  } = useMessage();

  const { data, status } = useQuery(
    ["getBotPlaygroundHistory", params.id, params.history_id],
    async () => {
      const url = params.history_id
        ? `bot/playground/${params.id}/history/${params.history_id}`
        : `bot/playground/${params.id}/history`;
      const response = await api.get(url);
      return response.data as BotPlaygroundHistory;
    },
    {
      keepPreviousData: true,
    }
  );

  React.useEffect(() => {
    if (status === "success" && data) {
      setStreaming(data.streaming);
      if (params.history_id) {
        setHistoryId(params.history_id);
        setMessages(data.messages);
        setHistory(
          data.messages.map((item) => {
            return {
              message: item.message,
              type: item.type,
            };
          })
        );
      }
      setIsLoading(false);
    }
  }, [status, data]);

  return (
    <div
      className={`flex-col flex-1 overflow-y-auto hide-scroll-bar border-b border-white/20 `}
    >
      <div className="flex flex-col gap-2 text-gray-100 text-sm">
        {status === "success" && (
          <>
            {data.history.length === 0 && (
              <div className="flex justify-center items-center mt-20">
                <Empty description="No history yet" />
              </div>
            )}
            {data.history.map((item, index) => {
              return <PlaygroundHistoryCard key={index} item={item} />;
            })}
          </>
        )}
        {status === "loading" && (
          <div className="flex justify-center items-center mt-20">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 "></div>
          </div>
        )}
        {status === "error" && (
          <div className="flex justify-center items-center">
            <span className="text-red-500">Error loading history</span>
          </div>
        )}
      </div>
    </div>
  );
};
