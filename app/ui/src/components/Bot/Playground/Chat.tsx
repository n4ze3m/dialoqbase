import { PlaygroundgForm } from "./Form";

export const PlaygroundChat = () => {
  return (
    <div className="px-4 sm:px-6 md:px-5 py-6 bg-white h-full">
     
      <div className="grow flex relative flex-col min-h-screen md:translate-x-0 transition-transform duration-300 ease-in-out">
        <div className="grow ">
          {/* {messages.map((message, index) => {
                  return (
                    <BotChatBubble
                      key={index}
                      message={message}
                      botStyle={botStyle}
                    />
                  );
                })}
                <div ref={divRef} /> */}
          chat message here
        </div>
      </div>
      <div className="sticky bottom-0 border bg-white">
        <PlaygroundgForm />
      </div>
    </div>
  );
};
