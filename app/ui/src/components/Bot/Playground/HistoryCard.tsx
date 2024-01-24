import { Link, useNavigate, useParams } from "react-router-dom";
import { useMessage } from "../../../hooks/useMessage";
import { PlaygroundHistory } from "./types";
import {
  EllipsisHorizontalIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Dropdown, notification } from "antd";
import api from "../../../services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const PlaygroundHistoryCard = ({
  item,
}: {
  item: PlaygroundHistory;
}) => {
  const { historyId, setHistoryId, setMessages, setHistory } = useMessage();
  const params = useParams<{ id: string; history_id?: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const onDelete = async () => {
    const url = `bot/playground/history/${item.id}`;
    const response = await api.delete(url);
    return response.data;
  };

  const { mutate: deleteHistory, isLoading: isDeleting } = useMutation(
    onDelete,
    {
      onSuccess: () => {
        setHistoryId(null);
        setMessages([]);
        setHistory([]);
        queryClient.invalidateQueries([
          "getBotPlaygroundHistory",
          params.id,
          params.history_id,
        ]);
        navigate(`/bot/${params.id}`);
      },
      onError: () => {
        notification.error({
          message: "Error",
          description: "Something went wrong",
        });
      },
    }
  );

  return (
    <Link
      to={`/bot/${params.id}/playground/${item.id}`}
      className={`flex py-2 px-2 items-center gap-3 relative rounded-md truncate hover:pr-4 group transition-opacity duration-300 ease-in-out ${
        historyId === item.id
          ? item.id === params.history_id
            ? "bg-gray-300 dark:bg-[#232222] dark:text-white"
            : "bg-gray-300 dark:bg-[#232222] dark:text-white"
          : "bg-gray-100 dark:bg-[#0a0a0a] dark:text-gray-200"
      }`}
    >
      <div className="flex-1 overflow-hidden break-all">
        <span
          className="text-gray-500 dark:text-gray-400 text-sm font-semibold truncate"
          title={item.title}
        >
          {item.title}
        </span>
      </div>
      <Dropdown
        menu={{
          items: [
            {
              key: "1",
              label: (
                <button
                  className="flex items-center gap-2 w-full "
                  onClick={() => {
                    alert("clicked 2");
                  }}
                >
                  <PencilIcon className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                  <span>Edit</span>
                </button>
              ),
            },
            {
              key: "2",
              label: (
                <button
                  disabled={isDeleting}
                  onClick={() => {
                    deleteHistory();
                  }}
                  className="flex items-center gap-2 w-full text-red-500"
                >
                  <TrashIcon className="w-3 h-3 text-red-500 dark:text-red-400" />
                  <span>Delete</span>
                </button>
              ),
            },
          ],
        }}
      >
        <EllipsisHorizontalIcon
          className={`text-gray-500 dark:text-gray-400 w-5 h-5 
      ${
        historyId === item.id
          ? item.id === params.history_id
            ? "opacity-100"
            : "opacity-100"
          : "opacity-0 hover:opacity-100 group-hover:opacity-100"
      }
      `}
        />
      </Dropdown>
    </Link>
  );
};
