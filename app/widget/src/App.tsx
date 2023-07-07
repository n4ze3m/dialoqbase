import React from "react";
import ReactMarkdown from "react-markdown";
import useQueryParams from "./hooks/useQueryParams";
import { ModeSwitcher } from "./components/ModeSwitcher";
// import useChatId from "./hooks/useChatId";
import { useForm } from "@mantine/form";
import axios from "axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getUrl } from "./utils/getUrl";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import { Loader } from "./components/Loader";
import { useMessage } from "./hooks/useMessage";

function App() {
  const divRef = React.useRef<HTMLDivElement>(null);

  // const chatid = useChatId();

  const params = useQueryParams();

  const form = useForm({
    initialValues: {
      message: "",
      isBot: false,
    },
  });

  React.useEffect(() => {
    if (divRef.current) {
      divRef.current.scrollIntoView({ behavior: "smooth" });
    }
  });

  const { messages, setMessages, setStreaming, onSubmit, setHistory } =
    useMessage();

  const { data: botStyle, status } = useQuery(
    ["getBotStyle"],
    async () => {
      const response = await axios.get(`${getUrl().split("?")[0]}/style`);
      return response.data as {
        data: {
          background_color?: string;
          bot_name: string;
          streaming: boolean;
          chat_bot_bubble_style?: {
            background_color?: string;
            text_color?: string;
          };
          chat_human_bubble_style?: {
            background_color?: string;
            text_color?: string;
          };
          first_message: string;
        };
      };
    },
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  React.useEffect(() => {
    if (botStyle?.data && messages.length === 0) {
      setStreaming(botStyle.data.streaming);
      setMessages([
        ...messages,
        { isBot: true, message: botStyle.data.first_message },
      ]);
    }
  }, [botStyle]);

  const { mutateAsync: sendMessage, isLoading: isSending } = useMutation(
    onSubmit,
    {
      onSuccess: () => {
        form.setFieldValue("message", "");
      },
      onError: (error) => {
        console.error(error);
        // setMessages([
        //   ...messages,
        //   { isBot: true, message: "Unable to send message" },
        // ]);
      },
    }
  );

  return (
    <div>
      <ModeSwitcher mode={params?.mode}>
        {status === "loading" && <Loader />}

        {status === "success" && (
          <>
            <div className="sticky top-0 z-10 ">
              <div className="flex justify-between bg-white border-b border-gray-100 p-4 items-center">
                {/* bot name here instead of brand name */}
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
            </div>
            <div className="grow flex flex-col md:translate-x-0 transition-transform duration-300 ease-in-out">
              <div className="grow px-4 sm:px-6 md:px-5 py-6">
                {messages.map((message, index) => {
                  return (
                    <div
                      key={index}
                      className={
                        message.isBot
                          ? "flex w-full mt-2 space-x-3 "
                          : "flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end"
                      }
                    >
                      <div>
                        <div
                          style={{
                            backgroundColor: message.isBot
                              ? botStyle.data.chat_bot_bubble_style
                                  ?.background_color
                              : botStyle.data.chat_human_bubble_style
                                  ?.background_color,
                            color: message.isBot
                              ? botStyle.data.chat_bot_bubble_style?.text_color
                              : botStyle.data.chat_human_bubble_style
                                  ?.text_color,
                          }}
                          className={
                            message.isBot
                              ? "p-3 rounded-r-lg rounded-bl-lg"
                              : " p-3 rounded-l-lg rounded-br-lg"
                          }
                        >
                          <p className="text-sm">
                            <ReactMarkdown
                              className="markdown"
                              remarkPlugins={[remarkGfm]}
                              components={{
                                code({
                                  node,
                                  inline,
                                  className,
                                  children,
                                  ...props
                                }) {
                                  const match = /language-(\w+)/.exec(
                                    className || ""
                                  );
                                  return !inline && match ? (
                                    <SyntaxHighlighter
                                      {...props}
                                      children={String(children).replace(
                                        /\n$/,
                                        ""
                                      )}
                                      style={atomDark}
                                      language={match[1]}
                                      PreTag="div"
                                    />
                                  ) : (
                                    <code className={className} {...props}>
                                      {children}
                                    </code>
                                  );
                                },
                                a({ node, ...props }) {
                                  return (
                                    <a
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-blue-500 hover:underline"
                                      {...props}
                                    >
                                      {props.children}
                                    </a>
                                  );
                                },
                                li({ node, ...props }) {
                                  return (
                                    <li className="list-decimal marker:text-gray-500" {...props}>
                                      {props.children}
                                    </li>
                                  );
                                },
                                ul({ node, ...props }) {
                                  return (
                                    <ul className="mx-2" {...props}>
                                      {props.children}
                                    </ul>
                                  );
                                },
                                ol({ node, ...props }) {
                                  return (
                                    <ul className="mx-2" {...props}>
                                      {props.children}
                                    </ul>
                                  );
                                },
                                h1({ node, ...props }) {
                                  return (
                                    <h1 className="text-2xl font-bold" {...props}>
                                      {props.children}
                                    </h1>
                                  );
                                },
                                h2({ node, ...props }) {
                                  return (
                                    <h2 className="text-xl font-bold" {...props}>
                                      {props.children}
                                    </h2>
                                  );
                                },
                                h3({ node, ...props }) {
                                  return (
                                    <h3 className="text-lg font-bold" {...props}>
                                      {props.children}
                                    </h3>
                                  );
                                },
                                h4({ node, ...props }) {
                                  return (
                                    <h4 className="text-base font-bold" {...props}>
                                      {props.children}
                                    </h4>
                                  );
                                },
                                h5({ node, ...props }) {
                                  return (
                                    <h5 className="text-sm font-bold" {...props}>
                                      {props.children}
                                    </h5>
                                  );
                                },
                                h6({ node, ...props }) {
                                  return (
                                    <h6 className="text-xs font-bold" {...props}>
                                      {props.children}
                                    </h6>
                                  );
                                },
                                p({ node, ...props }) {
                                  return (
                                    <p className="text-sm" {...props}>
                                      {props.children}
                                    </p>
                                  );
                                }
                              }}
                              
                            >
                              {message.message}
                            </ReactMarkdown>
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={divRef} />
              </div>
            </div>
            <div className="sticky bottom-0 bg-white">
              <div className="p-3 border-t">
                <div className="flex-grow space-y-6">
                  <div className="flex">
                    <span className="mr-3">
                      <button
                        disabled={isSending}
                        onClick={() => {
                          setHistory([]);
                          setMessages([
                            {
                              message: botStyle?.data?.first_message,
                              isBot: true,
                            },
                          ]);
                        }}
                        className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-3 h-11 text-sm font-medium text-gray-700  hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                        type="button"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-5 w-5 text-gray-600"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                          />
                        </svg>
                      </button>
                    </span>
                    <form
                      onSubmit={form.onSubmit(async (value) => {
                        form.reset();
                        await sendMessage(value.message);
                      })}
                      className="shrink-0 flex-grow  flex items-center "
                    >
                      <div className="relative w-full">
                        <textarea
                          // style={{ height: "48px !important" }}
                          disabled={isSending}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              form.onSubmit(async (value) => {
                                form.reset();
                                await sendMessage(value.message);
                                // await sendMessage(value.message);
                              })();
                            }
                          }}
                          className="block w-full h-11 resize-none  appearance-none bg-white text-md text-gray-900 caret-blue-600 rounded-lg border-gray-300  pl-3 pr-24 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                          required
                          placeholder="Type your message…"
                          {...form.getInputProps("message")}
                        />
                        <div className="absolute flex items-center bottom-0.5 right-0.5">
                          <button
                            disabled={isSending}
                            className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-blue-600 shadow-sm transition-all duration-150 rounded-md border border-transparent p-2 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
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
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </ModeSwitcher>
    </div>
  );
}

export default App;
