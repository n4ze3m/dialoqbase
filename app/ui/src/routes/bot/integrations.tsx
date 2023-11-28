import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import { SkeletonLoading } from "../../components/Common/SkeletonLoading";
import { IntegrationGrid } from "../../components/Bot/Integration/IntegrationGrid";

export default function BotIntegrationRoot() {
  const param = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, status } = useQuery(
    ["getBotEIntegration", param.id],
    async () => {
      const response = await api.get(`/bot/integration/${param.id}`);
      return response.data as {
        data: {
          name: string;
          channel: string;
          logo: string;
          link: string;
          description: string;
          fields: {
            name: string;
            type: string;
            title: string;
            description: string;
            help: string;
            requiredMessage: string;
            inputType: string;
            value: string;
          }[];
          isPaused: boolean;
          status: string;
          color: string;
          textColor: string;
          connectBtn?: {
            text: string;
            link: string;
          } | null;
        }[];
      };
    },
    {
      enabled: !!param.id,
    }
  );

  React.useEffect(() => {
    if (status === "error") {
      navigate("/");
    }
  }, [status]);

  return (
    <div className="mx-auto my-3 w-full max-w-7xl">
      {status === "loading" && <SkeletonLoading className="mt-6" />}
      {status === "success" && <IntegrationGrid data={data.data} />}
    </div>
  );
}
