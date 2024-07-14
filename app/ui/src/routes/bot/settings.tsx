import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import React from "react";
import { SkeletonLoading } from "../../components/Common/SkeletonLoading";
import { SettingsBody } from "../../components/Bot/Settings/SettingsBody";
import { BotSettings } from "../../@types/bot";

export default function BotSettingsRoot() {
  const param = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, status } = useQuery(
    ["getBotSettings", param.id],
    async () => {
      const response = await api.get(`/bot/${param.id}/settings`);
      return response.data as BotSettings;
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
    <div className="flex-1 py-8 md:py-12 px-4 md:px-6">
      <div className="max-w-6xl mx-auto grid gap-8">
        {status === "loading" && <SkeletonLoading />}
        {status === "success" && <SettingsBody {...data} />}
      </div>
    </div>
  );
}
