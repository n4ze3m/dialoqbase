import React from "react";
import { useMessage } from "../../../hooks/useMessage";
import { PlaygroundMessage } from "./Message";

export const PlaygroundChat = () => {
  const { messages } = useMessage();
  const divRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (divRef.current) {
      divRef.current.scrollIntoView({ behavior: "smooth" });
    }
  });
  return (
    <div className="grow  flex flex-col md:translate-x-0 transition-transform duration-300 ease-in-out">
      <div className="relative w-full transition-width flex flex-col overflow-hidden items-stretch flex-1">
        <div className="flex-1">
          <div className="h-full dark:bg-gray-800">
            <div className="">
              <div className="grow">
                {messages.length === 0 && (
                  <div>
                    {" "}
                    <h1 className="text-2xl sm:text-4xl font-semibold text-center text-gray-400 dark:text-gray-600 flex gap-2 items-center justify-center h-screen">
                      Dialoqbase Playground
                    </h1>
                  </div>
                )}
                {messages.map((message, index) => (
                  <PlaygroundMessage key={index} {...message} />
                ))}
                <div className="w-full h-32 md:h-48 flex-shrink-0"></div>

                <div ref={divRef} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
