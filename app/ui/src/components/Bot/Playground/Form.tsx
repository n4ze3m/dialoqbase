import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMessage } from "../../../hooks/useMessage";
import { useForm } from "@mantine/form";
import React from "react";
import { useStoreMessage } from "../../../store";
import { useSpeechRecognition } from "../../../hooks/useSpeechRecognition";

export const PlaygroundgForm = () => {
  const { onSubmit } = useMessage();
  const form = useForm({
    initialValues: {
      message: "",
      isBot: false,
    },
  });

  const client = useQueryClient();

  const {
    defaultSpeechToTextLanguage,
    setDefaultSpeechToTextLanguage,
    setDefaultWebTextToSpeechLanguageWebAPI,
    setElevenLabsDefaultVoice,
  } = useStoreMessage();

  const [hideListening, setHideListening] = React.useState(false);
  const {
    transcript,
    listening,
    supported: browserSupportsSpeechRecognition,
    listen,
    stop,
  } = useSpeechRecognition();

  React.useEffect(() => {
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

  React.useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setHideListening(true);
    } else {
      setHideListening(false);
    }
  }, [browserSupportsSpeechRecognition]);

  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

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

  const resetHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
    }
  };

  return (
    <div className="p-3 md:p-6 md:bg-white md:border md:rounded-t-xl">
      <div className="flex-grow space-y-6 ">
        <div className="flex">
          <form
            onSubmit={form.onSubmit(async (value) => {
              form.reset();
              resetHeight();
              await sendMessage(value.message);
            })}
            className="shrink-0 flex-grow  flex items-center "
          >
            <div className="relative flex max-h-40 w-full grow flex-col overflow-hidden bg-background px-8 rounded-md border sm:px-12 items-center">
              <textarea
                // disabled={isSendinhg}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !isSending) {
                    e.preventDefault();
                    form.onSubmit(async (value) => {
                      form.reset();
                      resetHeight();
                      await sendMessage(value.message);
                    })();
                  }
                }}
                ref={textareaRef}
                className={`min-h-[40px] w-full resize-none border-0 bg-transparent  py-[1rem] m-0 focus:ring-0 focus-visible:ring-0 dark:bg-transparent pr-2 md:pr-0 ${
                  listening && "placeholder:italic"
                }`}
                // className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm focus:ring-0 focus-visible:ring-0 dark:bg-transparent "
                required
                rows={1}
                tabIndex={0}
                placeholder={
                  !listening ? "Type your message…" : "Listening......"
                }
                {...form.getInputProps("message")}
              />
              {!hideListening && (
                <div className="absolute right-0 top-4 sm:right-4">
                  <button
                    disabled={isSending}
                    onClick={() => {
                      if (!listening) {
                        listen({
                          lang: defaultSpeechToTextLanguage,
                        });
                      } else {
                        stop();
                      }
                    }}
                    type="button"
                    className={`p-0 mr-2 text-gray-500  ${
                      listening &&
                      "animate-pulse ring-2 ring-blue-500 rounded-full ring-opacity-50"
                    }`}
                  >
                   <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      className="h-6 w-6"
      viewBox="0 0 24 24"
    >
      <path d="M12 2a3 3 0 00-3 3v7a3 3 0 006 0V5a3 3 0 00-3-3z"></path>
      <path d="M19 10v2a7 7 0 01-14 0v-2"></path>
      <path d="M12 19L12 22"></path>
    </svg>
                  </button>
                </div>
              )}
            </div>
            <button
              disabled={isSending}
              className="ml-6 rounded-md  bg-black  p-3 text-white disabled:opacity-40"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4"
                viewBox="0 0 24 24"
              >
                <path d="M9 10L4 15 9 20"></path>
                <path d="M20 4v7a4 4 0 01-4 4H4"></path>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
