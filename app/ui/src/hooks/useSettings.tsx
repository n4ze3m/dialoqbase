import { useQuery } from "@tanstack/react-query";
import api from "../services/api";

export const useSettings = () => {
  return useQuery(
    ["fetchDialoqbaseInfo"],
    async () => {
      const response = await api.get("/user/info");
      return response.data as {
        isRegistrationAllowed: boolean;
      };
    },
    {
      suspense: true,
    }
  );
};
