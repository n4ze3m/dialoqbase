import { BotStyle } from "../utils/types";

export default function BotSource({
  botStyle,
  source,
}: {
  botStyle: BotStyle;
  source: any;
}) {
  return (
    <div
      style={{
        backgroundColor: botStyle.data.chat_bot_bubble_style?.background_color,
        color: botStyle.data.chat_bot_bubble_style?.text_color,
      }}
      className="inline-flex items-center rounded-full    mt-2  px-3 py-0.5 text-sm font-medium"
    >
      <span className="text-sm">
        {
            source?.metadata?.path || source?.metadata?.source
        }
      </span>
    </div>
  );
}
