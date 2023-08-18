import { PlaygroundChat } from "./Chat";
import { PlaygroundMenu } from "./Menu";

export const PlaygroundBody = () => {
  return (
    <div className="relative md:ml-14 h-full">
      <div className="hidden md:block">
        <PlaygroundMenu />
      </div>
      <div className="md:ml-[260px] h-full">
     
        <PlaygroundChat />
      </div>
    </div>
  );
};
