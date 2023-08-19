
import { PlaygroundMessage } from "./Message";

export const PlaygroundChat = () => {
 
  return (
    <div className="grow  flex flex-col md:translate-x-0 transition-transform duration-300 ease-in-out">
      <div className="relative w-full transition-width flex flex-col overflow-hidden items-stretch flex-1">
        <div className="flex-1">
          <div className="h-full dark:bg-gray-800">
            <div className="">
              {/* show what ever */}
              <div className="grow">
                {/* {conversation.map((message, index) => (
                    <Message key={index} message={message} />
                  ))} */}

                {[...Array(6)].map((_, i) => {
                  return <PlaygroundMessage key={i} isUser={i % 2 === 0} />;
                })}
                                  <div className="w-full h-32 md:h-48 flex-shrink-0"></div>

                {/* <div ref={bottomOfChatRef}></div> */}
              </div>
              {/* <div className="py-10 relative w-full flex flex-col h-full">
                <h1 className="text-2xl sm:text-4xl font-semibold text-center text-gray-200 dark:text-gray-600 flex gap-2 items-center justify-center h-screen">
                  Dialoqbase Playground
                </h1>
              </div> */}
            </div>
          </div>
        </div>
      
      </div>
    </div>
  );
};
