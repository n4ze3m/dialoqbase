import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import React from "react";
import { SkeletonLoading } from "../../components/Common/SkeletonLoading";
import { SettingsCard } from "../../components/Bot/Settings/SettingsCard";

export default function BotSettingsRoot() {
  const param = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, status } = useQuery(
    ["getBotSettings", param.id],
    async () => {
      const response = await api.get(`/bot/${param.id}`);
      return response.data as {
        data: {
          id: string;
          name: string;
          model: string;
          public_id: string;
          temperature: number;
          embedding: string;
          qaPrompt: string;
          questionGeneratorPrompt: string;
          streaming: boolean;
          showRef: boolean;
          use_hybrid_search: boolean;
        };
      };
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
      {status === "success" && <SettingsCard data={data.data} />}
    </div>
  );
}
