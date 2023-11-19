import { useMutation } from "@tanstack/react-query";
import { useMessage } from "../hooks/useMessage";
import { useForm } from "@mantine/form";
import { BotStyle } from "../utils/types";

export default function BotForm({
    botStyle,
}: {
    botStyle: BotStyle
}) {
  const { onSubmit, setHistory, setMessages, resetChatId } = useMessage();

  const form = useForm({
    initialValues: {
      message: "",
      isBot: false,
    },
  });

  const { mutateAsync: sendMessage, isLoading: isSending } = useMutation(
    onSubmit,
    {
      onSuccess: () => {
        form.setFieldValue("message", "");
      },
    }
  );
  return (
    <div className="p-3 border-t">
      <div className="flex-grow space-y-6">
        <div className="flex">
          <span className="mr-3">
            <button
              disabled={isSending}
              onClick={() => {
                resetChatId()
                setHistory([]);
                setMessages([
                  {
                    message: botStyle?.data?.first_message,
                    isBot: true,
                    sources: []
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
  );
}
