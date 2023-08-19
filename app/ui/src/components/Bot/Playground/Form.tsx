export const PlaygroundgForm = () => {
  return (
    <div className="p-3 ">
      <div className="flex-grow space-y-6">
        <div className="flex">
          <form
            //   onSubmit={form.onSubmit(async (value) => {
            //     form.reset();
            //     await sendMessage(value.message);
            //   })}
            className="shrink-0 flex-grow  flex items-center "
          >
              <div className="flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
              <textarea
                // style={{ height: "48px !important" }}
                //   disabled={isSending}
                //   onKeyDown={(e) => {
                //     if (e.key === "Enter" && !e.shiftKey) {
                //       e.preventDefault();
                //       form.onSubmit(async (value) => {
                //         form.reset();
                //         await sendMessage(value.message);
                //         // await sendMessage(value.message);
                //       })();
                //     }
                //   }}
                style={{
                  height: "24px",
                  maxHeight: "200px",
                  overflowY: "hidden",
                }}
                className="m-0 w-full resize-none border-0 bg-transparent p-0 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent pl-2 md:pl-0"
                required
                placeholder="Type your message…"
                //   {...form.getInputProps("message")}
              />
              <div className="absolute flex items-center bottom-0.5 right-0.5">
                <button
                  // disabled={isSending}
                  className="absolute p-1 rounded-md bottom-1.5 md:bottom-2.5 bg-transparent disabled:bg-gray-500 right-1 md:right-2 disabled:opacity-40"
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
};
