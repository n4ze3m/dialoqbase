import { useMutation } from "@tanstack/react-query";
import { useMessage } from "../hooks/useMessage";
import { useForm } from "@mantine/form";
import { BotStyle } from "../utils/types";

export default function BotForm({}: { botStyle: BotStyle }) {
  const { onSubmit } = useMessage();

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
    <div className="p-3 md:p-6 bg-white border rounded-t-xl border-black/10 ">
      <div className="flex-grow space-y-6 ">
        <div className="flex">
          <form
            onSubmit={form.onSubmit(async (value) => {
              form.reset();
              await sendMessage(value.message);
            })}
            className="flex-grow  flex items-center"
          >
            <div className="flex items-cente rounded-full border  bg-gray-100 w-full dark:bg-black dark:border-gray-800">
              <textarea
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !isSending) {
                    e.preventDefault();
                    form.onSubmit(async (value) => {
                      form.reset();
                      await sendMessage(value.message);
                      // await sendMessage(value.message);
                    })();
                  }
                }}
                className="rounded-full pl-4 pr-2 w-full resize-none bg-transparent focus-within:outline-none sm:text-sm focus:ring-0 focus-visible:ring-0 ring-0 dark:ring-0 border-0 dark:text-gray-100"
                required
                rows={1}
                tabIndex={0}
                placeholder="Type your message…"
                {...form.getInputProps("message")}
              />
              <button disabled={isSending} className="mx-3">
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
  );
}
