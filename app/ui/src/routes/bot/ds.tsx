import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import React from "react";
import { SkeletonLoading } from "../../components/Common/SkeletonLoading";
import { DsTable } from "../../components/Bot/DS/DsTable";
import api from "../../services/api";
import { Pagination } from "antd";

export default function BotDSRoot() {
  const param = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);

  const { data: botData, status } = useQuery(
    ["getBotDS", param.id, page, limit],
    async () => {
      const response = await api.get(
        `/bot/${param.id}/source?page=${page}&limit=${limit}`
      );
      return response.data as {
        data: {
          id: string;
          type: string;
          content: string;
          status: string;
        }[];
        limit: number;
        page: number;
        total: number;
      };
    },
    {
      refetchInterval: 2 * 60 * 1000,
      keepPreviousData: true,
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
      {status === "success" && (
        <div className="px-4 sm:px-6 lg:px-8">
          <DsTable data={botData.data} />
          {botData.total >= 10 && (
            <div className="my-3 flex items-center justify-end">
              <Pagination
                onShowSizeChange={(current, size) => {
                  setPage(current);
                  setLimit(size);
                }}
                total={botData.total}
                current={botData.page}
                pageSize={botData.limit}
                showSizeChanger
                onChange={(page, pageSize) => {
                  setPage(page);
                  setLimit(pageSize);
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
