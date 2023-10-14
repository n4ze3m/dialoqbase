import React from "react";
import NoApiKeyComponent from "./NoApiKeyComponent";
import { BotIntegrationAPI } from "../../../../@types/bot";
import ApiPlaygroundComponent from "./ApiPlaygroundComponent";

const IntegrationAPIBody: React.FC<BotIntegrationAPI> = ({
  is_api_enabled,
}) => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4 text-left">API Integration</h2>
      {!is_api_enabled && <NoApiKeyComponent />}
      {is_api_enabled && <ApiPlaygroundComponent />}
    </div>
  );
};

export default IntegrationAPIBody;
