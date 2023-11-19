import { useMessage } from "../../../hooks/useMessage";
import { PlaygroundChat } from "./Chat";
import { PlaygroundgForm } from "./Form";
import { PlaygroundMenu } from "./Menu";
import { Skeleton } from "antd";

export const PlaygroundBody = () => {
  const { isLoading } = useMessage();
  return (
    <div className="relative md:ml-14">
      <div className="hidden md:block">
        <PlaygroundMenu />
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <Skeleton active paragraph={{ rows: 10 }} />
        </div>
      ) : (
        <>
          {" "}
          <div className="md:ml-[256px]">
            <PlaygroundChat />
          </div>
          <div className="md:ml-[100px]">
            <div className="bottom-0 w-full md:!bg-transparent md:!border-0 fixed border-t bg-white pt-2">
              <div className="stretch mx-2 flex flex-row gap-3 md:mx-4 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
                <div className="relative flex flex-col h-full flex-1 items-stretch md:flex-col">
                  <PlaygroundgForm />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
