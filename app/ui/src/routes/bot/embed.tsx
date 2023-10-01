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
    <div className="mx-auto mt-3 w-full max-w-7xl">
      {status === "loading" && <SkeletonLoading />}
      {status === "success" && data.inProgress && <Cooking />}
      {status === "success" && !data.inProgress && (
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-900">Embedding</h1>
              <p className="mt-2 text-sm text-gray-700">
                Embed your bot on your website or blog.
              </p>
            </div>
          </div>
          <div className="mx-auto mt-6 max-w-3xl lg:max-w-7xl">
            <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-3 lg:gap-8">
              <div className="grid grid-cols-1 gap-4 lg:col-span-2">
                <section aria-labelledby="section-1-title">
                  <div className="overflow-hidden rounded-lg bg-white border">
                    <div className="p-6">
                      <EmbedBoard public_id={data.public_id} />
                    </div>
                  </div>
                </section>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <section aria-labelledby="section-2-title">
                  <div className="overflow-hidden rounded-lg bg-white border">
                    <div>
                      <PreviewIframe public_id={data.public_id} />
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
