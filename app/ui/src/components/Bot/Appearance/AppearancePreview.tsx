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
          <div className="flex items-center">
            <span className="mr-3">
              <button type="button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6 text-gray-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                  />
                </svg>
              </button>
            </span>
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
        <div className="p-3 md:p-6 bg-white border rounded-t-xl text-black border-black/10 ">
          <div className="flex-grow space-y-6 ">
            <div className="flex">
              <form className="flex-grow  flex items-center">
                <div className="flex items-cente rounded-full border   bg-gray-100 w-full">
                  <textarea
                    className="rounded-full p-3 text-black  pl-4 pr-2 w-full resize-none bg-transparent focus-within:outline-none sm:text-sm focus:ring-0 focus-visible:ring-0 ring-0 dark:ring-0 border-0 dark:text-gray-100"
                    required
                    rows={1}
                    tabIndex={0}
                    placeholder="Type your message…"
                  />
                  <button className="mx-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                      />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
