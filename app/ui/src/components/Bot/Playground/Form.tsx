import { useMutation } from "@tanstack/react-query";
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
    const textarea = textareaRef.current;
    if (textarea) {
      const increaseHeight = () => {
        textarea.style.height = "auto";
        textarea.style.height = `${Math.min(textarea.scrollHeight, 300)}px`;
      };
      increaseHeight();
      textarea.addEventListener("input", increaseHeight);
      return () => textarea.removeEventListener("input", increaseHeight);
    }
  }, []);

  const { mutateAsync: sendMessage, isLoading: isSending } = useMutation(
    onSubmit,
    {
      onSuccess: () => {
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
    <div className="p-3 ">
      <div className="flex-grow space-y-6">
        <div className="flex">
          <form
            onSubmit={form.onSubmit(async (value) => {
              form.reset();
              resetHeight();
              await sendMessage(value.message);
            })}
            className="shrink-0 flex-grow  flex items-center "
          >
            <div className="flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
              <textarea
                // style={{ height: "48px !important" }}
                disabled={isSending}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    form.onSubmit(async (value) => {
                      form.reset();
                      resetHeight();
                      await sendMessage(value.message);
                      // reset the height of the textarea
                    })();
                  }
                }}
                ref={textareaRef}
                rows={1}
                className={`m-0 w-full resize-none border-0 bg-transparent p-0 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent pl-2 md:pl-0 ${
                  listening && "placeholder:italic"
                }`}
                required
                placeholder={
                  !listening ? "Type your message…" : "Listening......"
                }
                {...form.getInputProps("message")}
              />
              {!hideListening && (
                <div className="absolute flex items-center bottom-0.5 right-0.5">
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
                    className={`absolute p-1 rounded-md bottom-1.5 md:bottom-2 bg-transparent disabled:bg-gray-500 right-1 md:right-2 disabled:opacity-40 ${
                      // add mic animation with rings when listening
                      listening &&
                      "animate-pulse ring-2 ring-blue-500 rounded-full ring-opacity-50"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6 m-1 md:m-0"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
            <button
              disabled={isSending}
              className="p-1 ml-3 rounded-md  bg-transparent disabled:bg-gray-500  disabled:opacity-40"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6 m-1 md:m-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
