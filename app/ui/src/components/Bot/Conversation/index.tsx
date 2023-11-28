import { ConversationsByType } from "../../../@types/conversation";
import React from "react";
import { ConversationSidebar } from "./ConversationSidebar";
import { ConversationInfo } from "./ConversationInfo";

export const ConversationBody = ({
  data,
  setType,
  type,
}: {
  data: ConversationsByType[];
  type: string;
  setType: React.Dispatch<React.SetStateAction<string>>;
}) => {
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
          defaultChannel={type}
          onChannelChange={(value) => {
            setDefaultIndex(null);
            setType(value);
          }}
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
