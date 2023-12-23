import { useMessage } from "../hooks/useMessage";
import { BotStyle } from "../utils/types";
import { Tooltip } from "antd";

export default function BotHeader({
  botStyle,
  params,
}: {
  botStyle: BotStyle;
  params: any;
}) {
  const {  setHistory, setMessages, resetChatId } = useMessage();

  return (
    <div className="flex justify-between bg-white border-b border-gray-100 p-4 items-center">
      <p className="font-bold text-lg">
        {botStyle.data.bot_name || "Chat Bot"}
      </p>
      <div className="flex items-center">
        <span className="mr-3">
          <Tooltip title="Reset Chat">
            <button type="button"
             onClick={() => {
               resetChatId();
               setHistory([]);
               setMessages([
                 {
                   message: botStyle?.data?.first_message,
                   isBot: true,
                   sources: [],
                 },
               ]);
             }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6 text-gray-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            </button>
          </Tooltip>
        </span>
        {params?.mode === "iframe" && params.no !== "button" && (
          <Tooltip title="Close">

          <button
            onClick={() => {
              window.parent.postMessage("db-iframe-close", "*");
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </button>
          </Tooltip>
        )}
      </div>
    </div>
  );
}
