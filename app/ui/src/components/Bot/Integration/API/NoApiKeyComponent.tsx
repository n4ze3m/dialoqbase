import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notification } from "antd";
import React from "react";
import api from "../../../../services/api";
import { useParams } from "react-router-dom";

const NoApiKeyComponent: React.FC = () => {
  const client = useQueryClient();
  const param = useParams<{ id: string }>();
  const { mutate: generateAPIKey, isLoading: isGeneratingAPIKey } = useMutation(
    async () => {
      const response = await api.post(`/bot/integration/${param.id}/api`);
      return response.data;
    },
    {
      onSuccess: () => {
        notification.success({
          message: "Success",
          description: "API key generated successfully.",
        });
        client.invalidateQueries(["getBotIntegrationAPI"]);
      },
      onError: (e) => {
        console.log(e);
        notification.error({
          message: "Error",
          description: "Something went wrong while generating the API key.",
        });
      },
    }
  );

  return (
    <div className="m-0 p-0 h-screen flex flex-col justify-start items-center">
      <div className="mt-20 p-8 border bg-gray-50 border-gray-300 rounded-lg dark:bg-[#0a0a0a] dark:border-[#232222]">
        <h1 className="text-2xl font-semibold mb-4 dark:text-white">No API Key Found</h1>
        <p className="mb-4 dark:text-gray-500">You need to generate an API key to get started.</p>
        <button
          disabled={isGeneratingAPIKey}
          onClick={() => {
            generateAPIKey();
          }}
          className="bg-indigo-600 w-full text-center text-white px-4 py-2 rounded hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {!isGeneratingAPIKey ? "Generate API Key" : "Generating API Key..."}
        </button>
      </div>
    </div>
  );
};

export default NoApiKeyComponent;
