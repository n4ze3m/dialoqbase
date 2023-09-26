import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import React from "react";
import { SkeletonLoading } from "../../components/Common/SkeletonLoading";
import { ConversationsByType } from "../../@types/conversation";
import { ConversationBody } from "../../components/Bot/Conversation";
// import { PreviewIframe } from "../../components/Bot/Preview/PreviewIFrame";

export default function BotConversationsRoot() {
  const param = useParams<{
    id: string;
    type?: string;
    conversation_id?: string;
  }>();
  const navigate = useNavigate();
  const [defaultType] = React.useState<string>(param.type || "website");
  const { data, status } = useQuery(
    ["getBotConversations", param.id, param.type],
    async () => {
      const response = await api.get(
        `/bot/conversations/${param.id}/${defaultType}`
      );
      return response.data as {
        data: ConversationsByType[];
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
      {status === "loading" && (
        <div className="p-4 m-3">
          <SkeletonLoading />
        </div>
      )}
      {status === "success" && <ConversationBody data={data.data} />}
    </>
  );
}
