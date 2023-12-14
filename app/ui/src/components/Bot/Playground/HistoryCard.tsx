import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
import { Link, useParams } from "react-router-dom";
import { useMessage } from "../../../hooks/useMessage";
import { PlaygroundHistory } from "./types";

export const PlaygroundHistoryCard = ({
  item,
}: {
  item: PlaygroundHistory;
}) => {
  const { historyId, setMessages, setHistory, setIsLoading } = useMessage();
  const params = useParams<{ id: string; history_id?: string }>();
  return (
    <Link
      to={`/bot/${params.id}/playground/${item.id}`}
      onClick={() => {
        setIsLoading(true);
        setMessages([]);
        setHistory([]);
      }}
      className={`flex py-2 px-2 items-center gap-3 relative rounded-md truncate hover:pr-4 group transition-opacity duration-300 ease-in-out ${
        historyId === item.id
          ? item.id === params.history_id
            ? "bg-gray-300 dark:bg-[#232222] dark:text-white"
            : "bg-gray-300 dark:bg-[#232222] dark:text-white"
          : "bg-gray-100 dark:bg-[#0a0a0a] dark:text-gray-200"
      }`}
    >
      <ChatBubbleLeftIcon className="w-5 h-5 text-gray-400 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors" />
      <div className="flex-1 overflow-hidden break-all">
        <span
          className="text-gray-500 dark:text-gray-400 text-sm font-semibold truncate"
          title={item.title}
        >
          {item.title.length > 20
            ? item.title.substring(0, 20) + "..."
            : item.title}
        </span>
      </div>
    </Link>
  );
};
