import { useQuery } from "@tanstack/react-query";
import { PlaygroundHistoryCard } from "./HistoryCard";
import { useParams } from "react-router-dom";
import api from "../../../services/api";
import { BotPlaygroundHistory } from "./types";
import React from "react";
import { useMessage } from "../../../hooks/useMessage";
import { Empty, Skeleton } from "antd";
import { useStoreMessage } from "../../../store";

export const PlaygroundHistoryList = () => {
  const params = useParams<{ id: string; history_id?: string }>();
  const { setMessages, setHistory, setStreaming, setHistoryId, setIsLoading } =
    useMessage();

  const {
    setTextToSpeechEnabled,
    setDefaultWebTextToSpeechLanguageType,
    setDefualtTextSpeechSettings,
    setElevenLabsApiKeyPresent,
    setElevenLabsApiKeyValid,
    setVoices,
  } = useStoreMessage();

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
      setTextToSpeechEnabled(data.text_to_speech_enabled);
      setElevenLabsApiKeyPresent(data.eleven_labs_api_key_present);
      setElevenLabsApiKeyValid(data.eleven_labs_api_key_valid);
      setVoices(data.voices);
      setDefaultWebTextToSpeechLanguageType(data.text_to_speech_type);
      setDefualtTextSpeechSettings(data.text_to_speech_settings);
      setStreaming(data.streaming);
      if (params.history_id) {
        setHistoryId(params.history_id);
        setMessages(data.messages);
        setHistory(
          data.messages.map((item) => {
            return {
              text: item.message,
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
      className={`flex-col flex-1 overflow-y-auto   border-b border-white/20 `}
    >
      <div>
        {status === "success" && (
          <div>
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
          <div className="flex justify-center items-center mt-5">
            <Skeleton active paragraph={{ rows: 8 }} />
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
