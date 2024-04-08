import { PlayIcon, StopIcon } from "@heroicons/react/20/solid";
import { Message } from "../store";
import { BotStyle } from "../utils/types";
import BotSource from "./BotSource";
import Markdown from "./Markdown";
import { useVoice } from "../hooks/useVoice";

export default function BotChatBubble({
  message,
  botStyle,
}: {
  message: Message;
  botStyle: BotStyle;
}) {
  const { cancel, isPlaying, loading, speak } = useVoice();
  return (
    <div className="mt-2 flex flex-col">
      <div
        className={
          message.isBot
            ? "flex w-full space-x-3"
            : "flex w-full max-w-xs ml-auto justify-end space-x-3"
        }
      >
        <div>
          <div
            style={{
              backgroundColor: message.isBot
                ? botStyle.data.chat_bot_bubble_style?.background_color
                : botStyle.data.chat_human_bubble_style?.background_color,
              color: message.isBot
                ? botStyle.data.chat_bot_bubble_style?.text_color
                : botStyle.data.chat_human_bubble_style?.text_color,
            }}
            className={
              message.isBot
                ? "p-3 rounded-r-lg rounded-bl-lg"
                : "p-3 rounded-l-lg rounded-br-lg"
            }
          >
            <p className="text-sm">
              <Markdown message={message.message} />
            </p>
            {botStyle.data.tts && message.isBot && message.id !== "temp-id" && (
              <div className=" mt-3">
                <button
                  onClick={() => {
                    if (!isPlaying) {
                      speak({
                        id: message.id,
                      });
                    } else {
                      cancel();
                    }
                  }}
                  className="flex bg-white shadow-md items-center border justify-center w-6 h-6 rounded-full transition-colors duration-200"
                >
                  {!loading ? (
                    !isPlaying ? (
                      <PlayIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-500" />
                    ) : (
                      <StopIcon className="w-4 h-4 text-red-400 group-hover:text-red-500" />
                    )
                  ) : (
                    <svg
                      className="animate-spin h-5 w-5 text-gray-400 group-hover:text-gray-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  )}
                </button>
              </div>
            )}
          </div>
          <div className="flex flex-wrap items-start justify-start space-x-3">
            {botStyle.data.show_reference &&
              message.sources.map((source, index) => (
                <BotSource botStyle={botStyle} source={source} key={index} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
