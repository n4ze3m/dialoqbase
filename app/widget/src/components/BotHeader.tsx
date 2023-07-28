import { BotStyle } from "../utils/types";

export default function BotHeader({
  botStyle,
  params,
}: {
  botStyle: BotStyle;
  params: any;
}) {
  return (
    <div className="flex justify-between bg-white border-b border-gray-100 p-4 items-center">
      <p className="font-bold text-lg">
        {botStyle.data.bot_name || "Chat Bot"}
      </p>
      {params?.mode === "iframe" && params.no !== "button" && (
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
      )}
    </div>
  );
}
