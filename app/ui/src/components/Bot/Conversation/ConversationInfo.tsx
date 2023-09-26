import { UserIcon } from "@heroicons/react/24/outline";
import { ConversationsByType } from "../../../@types/conversation";
import { getOSAndBrowser } from "../../../utils/useragent";
import { PlaygroundMessage } from "../Playground/Message";

export const ConversationInfo = ({ data }: { data: ConversationsByType }) => {
  return (
    <div className="grow  flex flex-col md:translate-x-0 transition-transform duration-300 ease-in-out">
      <nav className="flex flex-col flex-1 p-3 overflow-y-auto bg-white border-b">
        <span className="text-md font-thin text-gray-500">
          {data?.metdata?.user_agent
            ? getOSAndBrowser(data?.metdata?.user_agent)
            : `Anonymous`}
        </span>
      </nav>
      <div className="flex-grow overflow-y-auto ">
        {data.all_messages.map((sender, index) => {
          return (
            <PlaygroundMessage
              isBot={sender.isBot}
              message={sender.message || ""}
              onSourceClick={() => {}}
              textToSpeech={false}
              textToSpeechType="web_api"
              sources={sender.sources}
              key={index}
              hideCopy={true}
              userAvatar={<div>
                <UserIcon className="w-10 h-10 text-gray-500" />
              </div>}
              botAvatar={
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-10 h-10 text-blue-500"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 8V4H8"></path>
                    <rect width="16" height="12" x="4" y="8" rx="2"></rect>
                    <path d="M2 14h2M20 14h2M15 13v2M9 13v2"></path>
                  </svg>
                </div>
              }
            />
          );
        })}
      </div>
    </div>
  );
};
