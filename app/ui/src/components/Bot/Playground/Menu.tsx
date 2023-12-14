import React from "react";
import { PlaygroundNewChat } from "./NewChat";
import { PlaygroundHistoryList } from "./HistoryList";
import PlaygroundFooter from "./Footer";

export const PlaygroundMenu = () => {
  const [hideMenu] = React.useState(false);
  return (
    <div
      id="menu"
      className={`bg-white z-[998] border fixed md:inset-y-0 md:flex md:w-[260px] md:flex-col transition-transform  max-md:w-3/4  ${
        hideMenu ? "translate-x-[-100%]" : "translate-x-[0%]"
      } dark:bg-black dark:border-gray-800`}
    >
      <div className="flex mt-16 h-full min-h-0 flex-col">
        <div className="flex h-full w-full flex-1 items-start">
          <nav className="flex h-full flex-1 flex-col space-y-3 px-2 pt-2 overflow-x-hidden">
            <div className="flex gap-2">
              <PlaygroundNewChat />
              <PlaygroundFooter />
            </div>
            {/* here */}
            <div className="flex-grow overflow-y-auto ">
              <PlaygroundHistoryList />
            </div>

            {/* footer */}
          </nav>
        </div>
      </div>
    </div>
  );
};
