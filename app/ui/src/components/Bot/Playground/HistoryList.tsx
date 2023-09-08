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
  const { setMessages, setHistory, setStreaming, setHistoryId, setIsLoading } =
    useMessage();

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
      className={`flex-col flex-1 overflow-y-auto  border-b border-white/20 `}
    >
      <div>
        {status === "success" && (
          <div >
            {data.history.length === 0 && (
              <div className="flex justify-center items-center mt-20 overflow-hidden">
                <Empty description="No history yet" />
              </div>
            )}
            <div className="flex flex-col gap-2 overflow-hidden text-gray-100 text-sm ">
              {data.history.map((item, index) => {
                return <PlaygroundHistoryCard key={index} item={item} />;
              })}
            </div>
          </div>
        )}
        {status === "loading" && (
          <div className="flex justify-center items-center mt-20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="animate-spin rounded-full h-6 w-6 text-gray-500"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L12 6"></path>
              <path d="M12 18L12 22"></path>
              <path d="M4.93 4.93L7.76 7.76"></path>
              <path d="M16.24 16.24L19.07 19.07"></path>
              <path d="M2 12L6 12"></path>
              <path d="M18 12L22 12"></path>
              <path d="M4.93 19.07L7.76 16.24"></path>
              <path d="M16.24 7.76L19.07 4.93"></path>
            </svg>
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
