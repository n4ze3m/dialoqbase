import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import React from "react";
import { SkeletonLoading } from "../../components/Common/SkeletonLoading";
import { AppearanceType } from "../../components/Bot/Appearance/types";
import { AppearanceBody } from "../../components/Bot/Appearance/AppearanceBody";

export default function BotAppearanceRoot() {
  const param = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, status } = useQuery(
    ["getBotAppearance", param.id],
    async () => {
      const response = await api.get(`/bot/appearance/${param.id}`);
      return response.data as AppearanceType;
    },
    {
      enabled: !!param.id,
      refetchInterval: 1000,
    }
  );

  React.useEffect(() => {
    if (status === "error") {
      navigate("/");
    }
  }, [status]);

  return (
    <div className="mx-auto my-3 w-full max-w-7xl ">
      {status === "loading" && <SkeletonLoading />}
      {status === "success" && <AppearanceBody {...data} />}
    </div>
  );
}
