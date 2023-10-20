import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import React from "react";
import { SkeletonLoading } from "../../components/Common/SkeletonLoading";
import { SettingsCard } from "../../components/Bot/Settings/SettingsCard";
import { BotSettings } from "../../@types/bot";

export default function BotSettingsRoot() {
  const param = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, status } = useQuery(
    ["getBotSettings", param.id],
    async () => {
      const response = await api.get(`/bot/${param.id}/settings`);
      return response.data as BotSettings
      
    },
    {
      refetchInterval: 1000,
    }
  );

  React.useEffect(() => {
    if (status === "error") {
      navigate("/");
    }
  }, [status]);
  return (
    <div className="mx-auto my-3 w-full max-w-7xl">
      {status === "loading" && <SkeletonLoading />}
      {status === "success" && <SettingsCard {...data} />}
    </div>
  );
}
