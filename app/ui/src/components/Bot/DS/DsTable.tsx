import {
  DocumentTextIcon,
  GlobeAltIcon,
  TrashIcon,
  ArrowPathIcon,
  DocumentArrowUpIcon,
  VideoCameraIcon,
  PlayCircleIcon,
} from "@heroicons/react/24/outline";
import { Empty, Modal, Tag, notification } from "antd";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import api from "../../../services/api";
import { useParams } from "react-router-dom";
import { NewDsForm } from "./NewDsForm";
import React from "react";
import { GithubIcon } from "../../Icons/GithubIcon";
import { YoutubeIcon } from "../../Icons/YoutubeIcon";
import { ApiIcon } from "../../Icons/ApiIcon";

export const DsTable = ({
  data,
}: {
  data: {
    id: string;
    type: string;
    content: string;
    status: string;
  }[];
}) => {
  const statusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "finished":
        return "green";
      case "pending":
        return "blue";
      case "failed":
        return "red";
      case "processing":
        return "yellow";
      default:
        return "blue";
    }
  };

  const typeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "website":
        return <GlobeAltIcon className="h-10 w-10 text-gray-400" />;
      case "pdf":
        return <DocumentArrowUpIcon className="h-10 w-10 text-gray-400" />;
      case "text":
        return <DocumentTextIcon className="h-10 w-10 text-gray-400" />;
      case "github":
        return <GithubIcon className="h-10 w-10 text-gray-400" />;
      case "mp4":
        return <VideoCameraIcon className="h-10 w-10 text-gray-400" />;
      case "mp3":
        return <PlayCircleIcon className="h-10 w-10 text-gray-400" />;
      case "youtube":
        return <YoutubeIcon className="h-10 w-10 text-gray-400" />;
      case "rest":
        return <ApiIcon className="h-10 w-10 text-gray-400" />;
      default:
        return <DocumentTextIcon className="h-10 w-10 text-gray-400" />;
    }
  };

  const [open, setOpen] = React.useState(false);

  const params = useParams<{ id: string }>();

  const client = useQueryClient();

  const { mutate: deleteDs } = useMutation(
    (id: string) => api.delete(`/bot/${params.id}/source/${id}`),
    {
      onSuccess: () => {
        client.invalidateQueries(["getBotDS", params.id]);
        notification.success({
          message: "Data source deleted successfully",
        });
      },
      onError: () => {
        notification.error({
          message: "Error while deleting data source",
        });
      },
    }
  );

  const { mutate: refetchDS } = useMutation(
    (id: string) => api.post(`/bot/${params.id}/source/${id}/refresh`),
    {
      onSuccess: () => {
        client.invalidateQueries(["getBotDS", params.id]);
        notification.success({
          message: "Data source updated successfully",
        });
      },
      onError: () => {
        notification.error({
          message: "Error while updating data source",
        });
      },
    }
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Data Sources</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">
            List of data sources that are currently being used by your bot.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setOpen(true)}
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Add new source
          </button>
        </div>
      </div>
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden bg-white ring-1 ring-black ring-opacity-5 md:rounded-lg dark:bg-[#0a0a0a]">
              {data.length === 0 && (
                <Empty description="No data sources found." className="m-8" />
              )}
              {data.length > 0 && (
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50 dark:bg-[#141414]">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 dark:text-gray-200"
                      >
                        Type
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200"
                      >
                        Content
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right text-sm font-semibold text-gray-900 dark:text-gray-200"
                      >
                        <span className="sr-only">Re-fetch</span>

                        <span className="sr-only">Remove</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white dark:bg-[#0a0a0a] dark:divide-gray-800">
                    {data.map((source) => (
                      <tr key={source.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {typeIcon(source.type)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {source.content.length > 50
                            ? source.content.substring(0, 50) + "..."
                            : source.content}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <Tag color={statusColor(source.status)}>
                            {source.status.toUpperCase()}
                          </Tag>
                        </td>

                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex justify-end space-x-2">
                            <button
                              type="button"
                              onClick={() => {
                                const confirm = window.confirm(
                                  "Are you sure you want to re-fetch this data source?"
                                );
                                if (confirm) {
                                  refetchDS(source.id);
                                }
                              }}
                              className="text-gray-400 hover:text-gray-500"
                            >
                              <ArrowPathIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => {
                                const confirm = window.confirm(
                                  "Are you sure you want to delete this data source?"
                                );
                                if (confirm) {
                                  deleteDs(source.id);
                                }
                              }}
                              type="button"
                              className="text-red-800 hover:text-red-500"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        title="Add new data source"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <NewDsForm onClose={() => setOpen(false)} />
      </Modal>
    </div>
  );
};
