import { FormInstance, Form } from "antd";

export const AppearancePreview = ({ form }: { form: FormInstance }) => {
  const botBubbleStyle = Form.useWatch("chat_bot_bubble_style", form);
  const humanBubbleStyle = Form.useWatch("chat_human_bubble_style", form);
  const botName = Form.useWatch("bot_name", form);
  const firstMessage = Form.useWatch("first_message", form);
  return (
    <div
      style={{
        height: "calc(100vh - 154px)",
        width: "100%",
        maxWidth: "100%",
        minWidth: "100%",
        minHeight: "100%",
      }}
      className="flex bg-white flex-col"
    >
      <div className="sticky top-0 z-10 ">
        <div className="flex justify-between bg-white border-b border-gray-100 p-4 items-center">
          <p className="font-bold text-lg">{botName}</p>
          <button>
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
        </div>
      </div>
      <div className="grow flex flex-col md:translate-x-0 transition-transform duration-300 ease-in-out">
        <div className="grow px-4 sm:px-6 md:px-5 py-6">
          <div className="flex w-full mt-2 space-x-3 ">
            <div
              className="p-3 rounded-r-lg rounded-bl-lg"
              style={{
                backgroundColor:
                  typeof botBubbleStyle?.background_color === "string"
                    ? botBubbleStyle?.background_color
                    : `#${botBubbleStyle?.background_color?.toHex()}`,

                color:
                  typeof botBubbleStyle?.text_color === "string"
                    ? botBubbleStyle?.text_color
                    : `#${botBubbleStyle?.text_color?.toHex()}`,
              }}
            >
              <p className="text-sm">{firstMessage}</p>
            </div>
          </div>

          <div className="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end">
            <div
              style={{
                backgroundColor:
                  typeof humanBubbleStyle?.background_color === "string"
                    ? humanBubbleStyle?.background_color
                    : `#${humanBubbleStyle?.background_color?.toHex()}`,

                color:
                  typeof humanBubbleStyle?.text_color === "string"
                    ? humanBubbleStyle?.text_color
                    : `#${humanBubbleStyle?.text_color?.toHex()}`,
              }}
              className="p-3 rounded-l-lg rounded-br-lg"
            >
              <p className="text-sm">Nice to meet you!</p>
            </div>
          </div>
        </div>
      </div>
      <div className="sticky bottom-0">
        <div className="p-3 border-t">
          <div className="flex-grow space-y-6">
            <div className="flex">
              <span className="mr-3">
                <button
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
              <form className="shrink-0 flex-grow  flex items-center ">
                <div className="relative w-full">
                  <textarea
                    className="block w-full h-11 resize-none  appearance-none bg-white text-md text-gray-900 caret-blue-600 rounded-lg border-gray-300  pl-3 pr-24 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                    required
                    placeholder="Type your message…"
                  />
                  <div className="absolute flex items-center bottom-0.5 right-0.5">
                    <button
                      type="button"
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
    </div>
  );
};
