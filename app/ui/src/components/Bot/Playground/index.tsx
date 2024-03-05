import { useMessage } from "../../../hooks/useMessage";
import { PlaygroundChat } from "./Chat";
import { PlaygroundgForm } from "./Form";
import { PlaygroundMenu } from "./Menu";
import { Skeleton } from "antd";

export const PlaygroundBody = () => {
  const { isLoading } = useMessage();
  return (
    <div className=" md:ml-14">
      <div className="flex flex-col">
        {" "}
        <div className="hidden  lg:block">
          <PlaygroundMenu />
        </div>
        <div className="flex-grow  flex-1">
          {isLoading ? (
            <div className="flex p-12 items-center justify-center h-full">
              <Skeleton active paragraph={{ rows: 10 }} />
            </div>
          ) : (
            <div>
              <div>
                <PlaygroundChat />
              </div>
              <div>
                <div className="bottom-0 w-full bg-transparent border-0 fixed pt-2">
                  <div className="stretch mx-2 flex flex-row gap-3 lg:mx-auto lg:max-w-2xl xl:max-w-3xl md:max-w-3xl md:mx-auto">
                    <div className="relative flex flex-col h-full flex-1 items-stretch md:flex-col">
                      <PlaygroundgForm />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
