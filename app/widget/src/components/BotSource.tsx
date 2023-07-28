import { useStoreReference } from "../store";
import { BotStyle } from "../utils/types";

export default function BotSource({
  // botStyle,
  source,
}: {
  botStyle: BotStyle;
  source: any;
}) {
  const { setOpenReferences, setReferenceData } = useStoreReference();

  return (
    <div
      // style={{
      //   backgroundColor: botStyle.data.chat_bot_bubble_style?.background_color,
      //   color: botStyle.data.chat_bot_bubble_style?.text_color,
      // }}
      onClick={() => {
        setReferenceData(source);
        setOpenReferences(true);
      }}
      className="inline-flex cursor-pointer transition-shadow duration-300 ease-in-out hover:shadow-lg  mt-2 items-center rounded-md bg-gray-100 px-2.5 py-0.5 text-sm font-medium text-gray-800"
    >
      <span className="text-xs">
        {source?.metadata?.path || source?.metadata?.source}
      </span>
    </div>
  );
}
