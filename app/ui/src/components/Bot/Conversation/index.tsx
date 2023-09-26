import { ConversationsByType } from "../../../@types/conversation";
import React from "react";
import { ConversationSidebar } from "./ConversationSidebar";
import { ConversationInfo } from "./ConversationInfo";

export const ConversationBody = ({ data }: { data: ConversationsByType[] }) => {
  const [defaultIndex, setDefaultIndex] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (data.length > 0) {
      setDefaultIndex(0);
    }
  }, [data]);

  return (
    <div className="relative md:ml-14">
      <div className="hidden md:block">
        <ConversationSidebar
          defaultIndex={defaultIndex}
          setDefaultIndex={setDefaultIndex}
          data={data}
        />
      </div>
      <div className="md:ml-[350px]">
        {defaultIndex !== null && (
          <ConversationInfo data={data[defaultIndex]} />
        )}
      </div>
    </div>
  );
};
