import React from "react";
import { ConversationsByType } from "../../../@types/conversation";
import { Empty, Select } from "antd";
import { getOSAndBrowser } from "../../../utils/useragent";
import { UserIcon } from "@heroicons/react/24/outline";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
dayjs.extend(relativeTime);

export const ConversationSidebar = ({
  data,
  defaultIndex,
  setDefaultIndex,
  onChannelChange,
  defaultChannel,
}: {
  data: ConversationsByType[];
  defaultIndex: number | null;
  setDefaultIndex: React.Dispatch<React.SetStateAction<number | null>>;
  onChannelChange: (value: string) => void;
  defaultChannel: string;
}) => {
  const [hideMenu] = React.useState(false);
  return (
    <div
      id="menu"
      className={`bg-white z-[999] border fixed md:inset-y-0 md:flex md:w-[350px] md:flex-col transition-transform  max-md:w-3/4  ${
        hideMenu ? "translate-x-[-100%]" : "translate-x-[0%]"
      } dark:bg-black dark:border-gray-800`}
    >
      <div className="flex mt-16 h-full min-h-0 flex-col">
        <div className="flex h-full w-full flex-1 items-start">
          <nav className="flex h-full flex-1 flex-col space-y-3 px-2 pt-2 overflow-x-hidden">
            <div className="flex-grow overflow-y-auto  border-b border-white/20 ">
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold dark:text-white">Conversations</h2>
                <Select
                  options={[
                    { label: "Website", value: "website" },
                    { label: "Telegram", value: "telegram" },
                    { label: "Discord", value: "discord" },
                    // { label: "WhatsApp", value: "whatsapp" },
                  ]}
                  onChange={(value) => onChannelChange(value)}
                  defaultValue={defaultChannel}
                  style={{ width: "100%" }}
                />
              </div>

              {data.length === 0 && (
                <div className="flex justify-center items-center mt-20 overflow-hidden">
                  <Empty description="No conversations yet" />
                </div>
              )}
              <div className="flex flex-col mt-2 gap-2 overflow-hidden text-sm ">
                {data.map((item, index) => {
                  return (
                    <button
                      onClick={() => setDefaultIndex(index)}
                      key={index}
                      className={`"w-full p-2 hover:bg-gray-100 cursor-pointer transition-colors duration-300 ease-in-out  border-b  ${
                        defaultIndex === index
                          ? "bg-gray-100 dark:bg-[#232222]"
                          : "dark:hover:bg-[#232222]"
                      } dark:border-gray-800 dark:hover:bg-[#232222]`}
                    >
                      <div className="flex text-gray-500 justify-between">
                        <h3 className="text-xs font-thin dark:text-gray-200">
                          {item?.metdata?.user_agent
                            ? getOSAndBrowser(item?.metdata?.user_agent)
                            : `Anonymous`}
                        </h3>
                        <span className="text-xs font-thin">
                          {item?.created_at &&
                            dayjs(item?.created_at).fromNow()}
                        </span>
                      </div>
                      <div className="flex mt-2  flex-col gap-1">
                        <div className="flex flex-row items-center gap-2">
                          <div>
                            <UserIcon className="w-4 h-4 text-gray-400" />
                          </div>
                          <p className="text-xs truncate font-thin dark:text-gray-200">
                            {item?.human}
                          </p>
                        </div>
                        <div className="flex flex-row items-center gap-2">
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
                              className="w-4 h-4 text-gray-400"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 8V4H8"></path>
                              <rect
                                width="16"
                                height="12"
                                x="4"
                                y="8"
                                rx="2"
                              ></rect>
                              <path d="M2 14h2M20 14h2M15 13v2M9 13v2"></path>
                            </svg>
                          </div>
                          <p className="text-xs truncate font-thin dark:text-gray-200">
                            {item?.bot}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};
