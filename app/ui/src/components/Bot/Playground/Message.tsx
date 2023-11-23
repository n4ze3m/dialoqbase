import {
  CheckIcon,
  ClipboardIcon,
  PlayIcon,
  StopIcon,
} from "@heroicons/react/24/outline";
import { Message } from "../../../store";
import Markdown from "../../Common/Markdown";
import React from "react";
import { removeUUID } from "../../../utils/filename";
import { useSpeechSynthesis } from "../../../hooks/useSpeechSynthesis";
import { useElevenLabsTTS } from "../../../hooks/useElevenLabsTTS";

type Props = Message & {
  onSourceClick(source: any): void;
  textToSpeech: boolean;
  textToSpeechType: string;
  hideCopy?: boolean;
  botAvatar?: JSX.Element;
  userAvatar?: JSX.Element;
};

export const PlaygroundMessage = (props: Props) => {
  const [isBtnPressed, setIsBtnPressed] = React.useState(false);

  React.useEffect(() => {
    if (isBtnPressed) {
      setTimeout(() => {
        setIsBtnPressed(false);
      }, 4000);
    }
  }, [isBtnPressed]);

  const { speak, cancel, speaking: isWebSpeaking } = useSpeechSynthesis();
  const {
    speak: speakElevenLabs,
    cancel: cancelElevenLabs,
    isPlaying: isElevenLabsPlaying,
    loading: isElevenLabsLoading,
  } = useElevenLabsTTS();

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
                !props.botAvatar ? (
                  <div className="absolute h-7 w-7 rounded-sm bg-gradient-to-r from-green-300 to-purple-400"></div>
                ) : (
                  props.botAvatar
                )
              ) : !props.userAvatar ? (
                <div className="absolute h-7 w-7 rounded-sm bg-black/50"></div>
              ) : (
                props.userAvatar
              )}
            </div>
          </div>
          <div className="relative flex w-[calc(100%-50px)] flex-col gap-1 md:gap-3 lg:w-[calc(100%-115px)]">
            <div className="flex flex-grow flex-col gap-3">
              <Markdown message={props.message} />
            </div>

            {props.isBot && (
              <div className="mt-3 flex flex-wrap gap-2">
                {props?.sources?.map((source, index) => (
                  <button
                    key={index}
                    onClick={props.onSourceClick.bind(null, source)}
                    className="inline-flex cursor-pointer transition-shadow duration-300 ease-in-out hover:shadow-lg  items-center rounded-md bg-gray-100 p-1 text-xs text-gray-800 border border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 opacity-80 hover:opacity-100"
                  >
                    <span className="text-xs">
                      {removeUUID(
                        `${
                          source?.metadata?.path || source?.metadata?.source
                        }`.replace("./uploads/", "")
                      )}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {props.isBot && (
            <div className="flex space-x-2">
              {!props.hideCopy && (
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

              {props.textToSpeech && props.textToSpeechType === "web_api" && (
                <button
                  onClick={() => {
                    if (!isWebSpeaking) {
                      speak({
                        text: props.message,
                      });
                    } else {
                      cancel();
                    }
                  }}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  {!isWebSpeaking ? (
                    <PlayIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-500" />
                  ) : (
                    <StopIcon className="w-4 h-4 text-red-400 group-hover:text-red-500" />
                  )}
                </button>
              )}

              {props.textToSpeech &&
                props.textToSpeechType === "elevenlabs" && (
                  <button
                    disabled={isElevenLabsLoading}
                    onClick={() => {
                      if (!isElevenLabsPlaying) {
                        speakElevenLabs({
                          text: props.message,
                        });
                      } else {
                        cancelElevenLabs();
                      }
                    }}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    {!isElevenLabsLoading ? (
                      !isElevenLabsPlaying ? (
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
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
