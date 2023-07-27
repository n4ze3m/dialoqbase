import { Message } from "../store";
import { BotStyle } from "../utils/types";
import BotSource from "./BotSource";
import Markdown from "./Markdown";

export default function BotChatBubble({
  message,
  botStyle,
}: {
  message: Message;
  botStyle: BotStyle;
}) {
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
