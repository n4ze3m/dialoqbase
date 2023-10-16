import { BotIntegrationAPI } from "../../../../@types/bot";
import { CopyBtn } from "../../../Common/CopyBtn";

const ApiPlaygroundComponent: React.FC<BotIntegrationAPI> = () => {
  return (
    <div className="min-h-screen ">
      <div className="bg-gray-50 border rounded-md p-4 max-w-screen-xl mx-auto">
        <div className="flex mb-4">
          {/* span green [POST] tailwind */}
          <div className="flex-1">
            <input
              type="text"
              className="block w-full rounded-md border-gray-200 focus:border-sky-500 focus:ring-sky-500 sm:text-sm bg-gray-50"
              placeholder="https://api.example.com/v1/endpoint"
            />
          </div>
          <div>
            <CopyBtn showText={false} value="https://api.example.com/v1/endpoint" />
          </div>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-md p-4">
            <h2 className="text-lg font-semibold mb-2">LEFT PANEL</h2>
            {/* Content of left panel */}
          </div>

          <div className="border rounded-md p-4">
            <h2 className="text-lg font-semibold mb-2">RIGHT PANEL</h2>
            {/* Content of right panel */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiPlaygroundComponent;
