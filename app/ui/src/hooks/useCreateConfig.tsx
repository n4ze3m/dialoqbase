import { useQuery } from "@tanstack/react-query";
import api from "../services/api";

export const useCreateConfig = () => {
  return useQuery(
    ["fetchBotCreateConfig"],
    async () => {
      const response = await api.get("/bot/config");
      return response.data as {
        chatModel: {
          label: string;
          value: string;
          stream: string;
        }[];
        embeddingModel: {
          label: string;
          value: string;
        }[];
      };
    }
  );
};
