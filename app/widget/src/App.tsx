import React from "react";
import useQueryParams from "./hooks/useQueryParams";
import { ModeSwitcher } from "./components/ModeSwitcher";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { getUrl } from "./utils/getUrl";
import { Loader } from "./components/Loader";
import { useMessage } from "./hooks/useMessage";
import BotHeader from "./components/BotHeader";
import BotForm from "./components/BotForm";
import BotChatBubble from "./components/BotChatBubble";
import { BotStyle } from "./utils/types";
import { Modal } from "antd";
import { useStoreReference } from "./store";
function App() {
  const { openReferences, setOpenReferences, referenceData } =
    useStoreReference();

  const divRef = React.useRef<HTMLDivElement>(null);
  const { messages, setMessages, setStreaming, setHistory } = useMessage();

  const params = useQueryParams();

  React.useEffect(() => {
    if (divRef.current) {
      divRef.current.scrollIntoView({ behavior: "smooth" });
    }
  });

  const { data: botStyle, status } = useQuery(
    ["getBotStyle"],
    async () => {
      const response = await axios.get(`${getUrl().split("?")[0]}/style`);
      return response.data as BotStyle;
    },
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  React.useEffect(() => {
    if (botStyle?.data && messages.length === 0) {
      const history = localStorage.getItem("DS_HISTORY");
      const localMessages = localStorage.getItem("DS_MESSAGE");
      setStreaming(botStyle.data.streaming);
      setHistory(history ? JSON.parse(history) : []);
      if (localMessages && localMessages.length > 0) {
        setMessages(JSON.parse(localMessages));
      } else {
        setMessages([
          ...messages,
          { isBot: true, message: botStyle.data.first_message, sources: [] },
        ]);
      }
    }
  }, [botStyle]);

  return (
    <div>
      <ModeSwitcher mode={params?.mode}>
        {status === "loading" && <Loader />}

        {status === "success" && (
          <>
            <div className="sticky top-0 z-10 ">
              <BotHeader botStyle={botStyle} params={params} />
            </div>
            <div className="grow flex flex-col md:translate-x-0 transition-transform duration-300 ease-in-out">
              <div className="grow px-4 sm:px-6 md:px-5 py-6">
                {messages.map((message, index) => {
                  return (
                    <BotChatBubble
                      key={index}
                      message={message}
                      botStyle={botStyle}
                    />
                  );
                })}
                <div ref={divRef} />
              </div>
            </div>
            <div className="sticky bottom-0 bg-white">
              <BotForm botStyle={botStyle} />
            </div>
          </>
        )}
      </ModeSwitcher>

      <Modal
        title={
          <h3 className="text-md font-medium leading-6 text-gray-900">
            {referenceData?.metadata?.path || referenceData?.metadata?.source}
          </h3>
        }
        open={openReferences}
        onCancel={() => setOpenReferences(false)}
        onOk={() => setOpenReferences(false)}
        footer={null}
      >
        <p className="text-xs text-gray-500 font-normal">
          {referenceData?.content || referenceData?.pageContent}
        </p>
      </Modal>
    </div>
  );
}

export default App;
