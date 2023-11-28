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
  const [type, setType] = React.useState<string>(param.type || "website");
  const { data, status } = useQuery(
    ["getBotConversations", param.id, param.type, type],
    async () => {
      const response = await api.get(`/bot/conversations/${param.id}/${type}`);
      return response.data as {
        data: ConversationsByType[];
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
    <>
      {status === "loading" && (
        <div className="mx-auto my-3 w-full max-w-7xl">
          <SkeletonLoading className="mt-6" />
        </div>
      )}
      {status === "success" && (
        <ConversationBody setType={setType} type={type} data={data.data} />
      )}
    </>
  );
}
