import { useQuery } from "@tanstack/react-query";
import api from "../services/api";

export const useIsAdmin = () => {
  return useQuery(
    ["fetchDialoqbaseUserInfo"],
    async () => {
      const response = await api.get("/user/is-admin");
      return response.data as {
        is_admin: boolean;
      };
    },
    {
      suspense: true,
    }
  );
};
