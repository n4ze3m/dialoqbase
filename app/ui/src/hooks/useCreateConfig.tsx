import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import { BotConfig } from "../@types/bot";

export const useCreateConfig = () => {
  return useQuery(
    ["fetchBotCreateConfig"],
    async () => {
      const response = await api.get("/bot/config");
      return response.data as BotConfig;
    }
  );
};
