import { useMessage } from "../../../hooks/useMessage";
import { PlaygroundChat } from "./Chat";
import { PlaygroundgForm } from "./Form";
import { PlaygroundMenu } from "./Menu";
import { Skeleton } from "antd";

export const PlaygroundBody = () => {
  const { isLoading } = useMessage();
  return (
    <div className="relative md:ml-14">
      <div className="flex flex-col">
        {" "}
        <div className="hidden md:block">
          <PlaygroundMenu />
        </div>
        <div className="flex-grow md:pl-[100px]">
          {isLoading ? (
            <div className="flex p-12 items-center justify-center h-full">
              <Skeleton active paragraph={{ rows: 10 }} />
            </div>
          ) : (
            <div>
              <div className="md:ml-[150px]">
                <PlaygroundChat />
              </div>
              <div>
                <div className="bottom-0 w-full bg-transparent border-0 fixed pt-2">
                  <div className="stretch mx-2 flex flex-row gap-3 md:mx-4 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
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
