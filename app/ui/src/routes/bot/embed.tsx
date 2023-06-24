import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import React from "react";
import { SkeletonLoading } from "../../components/Common/SkeletonLoading";
import { Cooking } from "../../components/Common/Cooking";
import { EmbedBoard } from "../../components/Bot/Embed/EmbedBoard";
import { PreviewIframe } from "../../components/Bot/Preview/PreviewIFrame";

export default function BotEmbedRoot() {
  const param = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, status } = useQuery(
    ["getBotEmbedding", param.id],
    async () => {
      const response = await api.get(`/bot/${param.id}/embed`);
      return response.data as {
        inProgress: boolean;
        public_id: string;
      };
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
    <>
      {status === "loading" && <SkeletonLoading />}
      {status === "success" && data.inProgress && <Cooking />}
      {status === "success" && !data.inProgress && (
        <>
          <div className="mx-auto max-w-3xl px-2 lg:max-w-7xl">
            <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
              <div className="grid grid-cols-1 gap-4 lg:col-span-2">
                <section aria-labelledby="section-1-title">
                  <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="p-6">
                      <EmbedBoard public_id={data.public_id} />
                    </div>
                  </div>
                </section>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <section aria-labelledby="section-2-title">
                  <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div>
                      <PreviewIframe public_id={data.public_id} />
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
