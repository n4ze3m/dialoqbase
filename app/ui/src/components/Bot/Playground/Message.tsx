import {
  CheckIcon,
  ClipboardIcon,
} from "@heroicons/react/24/outline";
import { Message } from "../../../store";
import Markdown from "../../Common/Markdown";
import React from "react";

export const PlaygroundMessage = (props: Message) => {
  const [isBtnPressed, setIsBtnPressed] = React.useState(false);

  React.useEffect(() => {
    if (isBtnPressed) {
      setTimeout(() => {
        setIsBtnPressed(false);
      }, 4000);
    }
  }, [isBtnPressed]);

  return (
    <div
      className={`group w-full text-gray-800 dark:text-gray-100 border-b border-black/10 dark:border-gray-900/50 ${
        !props.isBot ? "dark:bg-gray-800" : "bg-gray-50 dark:bg-[#444654]"
      }`}
    >
      <div className="text-base gap-4 md:gap-6 md:max-w-2xl lg:max-w-xl xl:max-w-3xl flex lg:px-0 m-auto w-full">
        <div className="flex flex-row gap-4 md:gap-6 md:max-w-2xl lg:max-w-xl xl:max-w-3xl p-4 md:py-6 lg:px-0 m-auto w-full">
          <div className="w-8 flex flex-col relative items-end">
            <div className="relative h-7 w-7 p-1 rounded-sm text-white flex items-center justify-center  text-opacity-100r">
              {props.isBot ? (
                <div className="absolute h-7 w-7 rounded-sm bg-gradient-to-r from-green-300 to-purple-400"></div>
              ) : (
                <div className="absolute h-7 w-7 rounded-sm bg-black/50"></div>
              )}
            </div>
          </div>
          <div className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
            <div className="flex flex-grow flex-col gap-3">
              <div className="min-h-20 flex flex-col items-start gap-4 whitespace-pre-wrap break-words">
                <div className="w-full break-words dark:prose-invert dark">
                  {props.isBot ? (
                    <Markdown message={props.message} />
                  ) : (
                    <p className="text-sm">{props.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          {props.isBot && (
            <button
              onClick={() => {
                navigator.clipboard.writeText(props.message);
                setIsBtnPressed(true);
              }}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              {!isBtnPressed ? (
                <ClipboardIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-500" />
              ) : (
                <CheckIcon className="w-4 h-4 text-green-400 group-hover:text-green-500" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
