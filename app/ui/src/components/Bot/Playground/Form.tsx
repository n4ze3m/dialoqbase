import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMessage } from "../../../hooks/useMessage";
import { useForm } from "@mantine/form";
import React, { useState } from "react";
import { useStoreMessage } from "../../../store";
import { useSpeechRecognition } from "../../../hooks/useSpeechRecognition";
import { Tooltip } from "antd";
import { MicrophoneIcon } from "@heroicons/react/24/outline";
import useDynamicTextareaSize from "../../../hooks/useDynamicTextareaSize";

export const PlaygroundgForm = () => {
  const { onSubmit } = useMessage();
  const form = useForm({
    initialValues: {
      message: "",
      isBot: false,
    },
  });

  const client = useQueryClient();
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [typing, setTyping] = useState<boolean>(false);

  const {
    defaultSpeechToTextLanguage,
    setDefaultSpeechToTextLanguage,
    setDefaultWebTextToSpeechLanguageWebAPI,
    setElevenLabsDefaultVoice,
  } = useStoreMessage();

  const {
    transcript,
    listening,
    supported: browserSupportsSpeechRecognition,
    listen,
    stop,
  } = useSpeechRecognition();

  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef?.current?.focus();
    }
    const defaultLanguageFromLocalStorage = localStorage.getItem(
      "defaultSpeechToTextLanguage"
    );
    const defaultWebTextToSpeechLanguageWebAPIFromLocalStorage =
      localStorage.getItem("defaultWebTextToSpeechLanguageWebAPI");
    if (defaultLanguageFromLocalStorage) {
      setDefaultSpeechToTextLanguage(defaultLanguageFromLocalStorage);
    } else {
      setDefaultSpeechToTextLanguage(window.navigator.language);
    }

    if (defaultWebTextToSpeechLanguageWebAPIFromLocalStorage) {
      setDefaultWebTextToSpeechLanguageWebAPI(
        defaultWebTextToSpeechLanguageWebAPIFromLocalStorage
      );
    }

    const defaultElevenLabsDefaultVoiceFromLocalStorage = localStorage.getItem(
      "elevenLabsDefaultVoice"
    );

    if (defaultElevenLabsDefaultVoiceFromLocalStorage) {
      setElevenLabsDefaultVoice(defaultElevenLabsDefaultVoiceFromLocalStorage);
    }
  }, []);

  React.useEffect(() => {
    form.setFieldValue("message", transcript);
  }, [transcript]);

  const { mutateAsync: sendMessage, isLoading: isSending } = useMutation(
    onSubmit,
    {
      onSuccess: () => {
        client.invalidateQueries(["getBotPlaygroundHistory"]);
        form.setFieldValue("message", "");
      },
      onError: (error) => {
        console.error(error);
      },
    }
  );

  useDynamicTextareaSize(textareaRef, form.values.message, 300);

  return (
    <div className="px-3 pt-3 md:px-6 md:pt-6 md:bg-white dark:bg-[#1e1e1e] border rounded-t-xl   border-black/10 dark:border-gray-600">
      <div>
        <div className="flex">
          <form
            onSubmit={form.onSubmit(async (value) => {
              form.reset();
              await sendMessage(value.message);
            })}
            className="shrink-0 flex-grow  flex flex-col items-center "
          >
            <div className="w-full border-x border-t flex flex-col dark:border-gray-600 rounded-t-xl p-2">
              <textarea
                ref={textareaRef}
                onKeyDown={(e) => {
                  if (
                    !typing &&
                    e.key === "Enter" &&
                    !e.shiftKey &&
                    !isSending
                  ) {
                    e.preventDefault();
                    form.onSubmit(async (value) => {
                      if (value.message.trim().length === 0) {
                        return;
                      }
                      form.reset();
                      await sendMessage(value.message);
                    })();
                  }
                }}
                className="px-2 py-2 w-full resize-none bg-transparent focus-within:outline-none  focus:ring-0 focus-visible:ring-0 ring-0 dark:ring-0 border-0 dark:text-gray-100"
                required
                rows={1}
                style={{ minHeight: "60px" }}
                tabIndex={0}
                placeholder="Type a message..."
                onCompositionStart={() => setTyping(true)}
                onCompositionEnd={() => setTyping(false)}
                {...form.getInputProps("message")}
              />
              <div className="flex mt-4 justify-end gap-3">
                <Tooltip title="Voice Message">
                  <button
                    hidden={!browserSupportsSpeechRecognition}
                    type="button"
                    onClick={() => {
                      if (!listening) {
                        listen({
                          lang: defaultSpeechToTextLanguage,
                        });
                      } else {
                        stop();
                      }
                    }}
                    className={`flex items-center justify-center dark:text-gray-300`}
                  >
                    {!listening ? (
                      <MicrophoneIcon className="h-5 w-5" />
                    ) : (
                      <div className="relative">
                        <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
                        <MicrophoneIcon className="h-5 w-5" />
                      </div>
                    )}
                  </button>
                </Tooltip>

                <button
                  disabled={isSending || form.values.message.length === 0}
                  className="inline-flex items-center rounded-md border border-transparent bg-black px-2 py-2  font-medium leading-4 text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-white dark:text-gray-800 dark:hover:bg-gray-100 dark:focus:ring-gray-500 dark:focus:ring-offset-gray-100 disabled:opacity-50 "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 mr-2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 10L4 15 9 20"></path>
                    <path d="M20 4v7a4 4 0 01-4 4H4"></path>
                  </svg>
                  Send
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
