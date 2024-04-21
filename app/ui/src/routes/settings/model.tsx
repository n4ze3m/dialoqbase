import { Table, Tag, Modal, notification, Tooltip, Radio } from "antd";
import React from "react";
import api from "../../services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { SettingsLayout } from "../../Layout/SettingsLayout";
import { SkeletonLoading } from "../../components/Common/SkeletonLoading";
import { useNavigate } from "react-router-dom";
import { GetAllModelResponse } from "../../@types/settings";
import { EyeIcon, EyeSlashIcon, TrashIcon } from "@heroicons/react/24/outline";
import { LLMForm } from "../../components/Settings/Model/LLMForm";
import { EMForm } from "../../components/Settings/Model/EMForm";

export default function SettingsModelRoot() {
  const navigate = useNavigate();
  const [openAddModel, setOpenAddModel] = React.useState(false);
  const client = useQueryClient();

  const [openAddEmbeddingModel, setOpenAddEmbeddingModel] =
    React.useState(false);
  const [modelType, setModelType] = React.useState<"llm" | "embedding">("llm");

  const { data, status } = useQuery(["fetchAllModels"], async () => {
    const response = await api.get("/admin/models");
    return response.data as GetAllModelResponse;
  });

  React.useEffect(() => {
    if (status === "error") {
      navigate("/settings");
    }
  }, [status]);

  const hideModel = async (id: number) => {
    const response = await api.post(`/admin/models/hide`, {
      id,
    });
    return response.data;
  };

  const deleteModel = async (id: number) => {
    const response = await api.post(`/admin/models/delete`, {
      id,
    });
    return response.data;
  };

  const { mutate: hide, isLoading: isHide } = useMutation(hideModel, {
    onSuccess: () => {
      notification.success({
        message: "Model hidden successfully",
      });
      client.invalidateQueries(["fetchAllModels"]);
    },
    onError: (e: any) => {
      const message = e?.response?.data?.message || "Something went wrong";
      notification.error({
        message,
      });
    },
  });

  const { mutate: del, isLoading: isDelete } = useMutation(deleteModel, {
    onSuccess: () => {
      notification.success({
        message: "Model deleted successfully",
      });
      client.invalidateQueries(["fetchAllModels"]);
    },
    onError: (e: any) => {
      const message = e?.response?.data?.message || "Something went wrong";
      notification.error({
        message,
      });
    },
  });

  return (
    <SettingsLayout>
      {status === "loading" && <SkeletonLoading />}
      {status === "success" && (
        <>
          <div>
            <div>
              <div className="flex justify-between">
                <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                  All Models
                </h2>
                {modelType === "llm" && (
                  <button
                    type="button"
                    onClick={() => setOpenAddModel(true)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add New Chat Model
                  </button>
                )}
                {modelType === "embedding" && (
                  <button
                    type="button"
                    onClick={() => setOpenAddEmbeddingModel(true)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add New Embedding Model
                  </button>
                )}
              </div>
              <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-200">
                Manage all the AI models in your organization.
              </p>

              <dl className="mt-6 space-y-6 divide-y divide-gray-100   text-sm leading-6 ">
                <div className="mt-5 md:col-span-2 md:mt-0 ">
                  <div className="my-3 justify-end flex">
                    <Radio.Group
                      value={modelType}
                      onChange={(e) => setModelType(e.target.value)}
                    >
                      <Radio.Button value="llm">LLM</Radio.Button>
                      <Radio.Button value="embedding">
                        Embedding Model
                      </Radio.Button>
                    </Radio.Group>
                  </div>
                  <div className="sm:overflow-x-none overflow-x-auto">
                    {modelType === "llm" && (
                      <Table
                        // pagination={false}
                        bordered
                        dataSource={data.data}
                        columns={[
                          {
                            dataIndex: "name",
                            key: "name",
                            title: "Model Name",
                            render: (text) => text || "Untitled Model",
                          },
                          {
                            dataIndex: "model_id",
                            title: "Model ID",
                            key: "model_id",
                            render: (text: string) =>
                              text
                                .replace("-dbase", "")
                                .replace(/_dialoqbase_[0-9]+$/, ""),
                            className: "text-gray-500",
                          },
                          {
                            dataIndex: "model_provider",
                            title: "Provider",
                            key: "model_provider",
                          },
                          {
                            dataIndex: "stream_available",
                            title: "Stream",
                            key: "stream_available",
                            render: (value) => (
                              <Tag color={value ? "green" : "red"}>
                                {value ? "Available" : "Unavailable"}
                              </Tag>
                            ),
                          },
                          {
                            title: "Action",
                            render: (record) =>
                              record.local_model ? (
                                <div className="flex flex-row gap-2">
                                  <Tooltip title="Hide Model from Users">
                                    <button
                                      type="button"
                                      disabled={isHide}
                                      onClick={() => {
                                        hide(record.id);
                                      }}
                                      className="text-gray-400 hover:text-gray-500"
                                    >
                                      {record.hide ? (
                                        <EyeSlashIcon className="h-5 w-5" />
                                      ) : (
                                        <EyeIcon className="h-5 w-5" />
                                      )}
                                    </button>
                                  </Tooltip>
                                  <Tooltip title="Delete Model">
                                    <button
                                      type="button"
                                      disabled={isDelete}
                                      onClick={() => {
                                        const confirm = window.confirm(
                                          "Are you sure you want to delete this model?"
                                        );

                                        if (confirm) {
                                          del(record.id);
                                        }
                                      }}
                                      className="text-red-400 hover:text-red-500"
                                    >
                                      <TrashIcon className="h-5 w-5" />
                                    </button>
                                  </Tooltip>
                                </div>
                              ) : (
                                <Tooltip title="Hide Model from Users">
                                  <button
                                    type="button"
                                    disabled={isHide}
                                    onClick={() => {
                                      hide(record.id);
                                    }}
                                    className="text-gray-400 hover:text-gray-500"
                                  >
                                    {record.hide ? (
                                      <EyeSlashIcon className="h-5 w-5" />
                                    ) : (
                                      <EyeIcon className="h-5 w-5" />
                                    )}
                                  </button>
                                </Tooltip>
                              ),
                          },
                        ]}
                      />
                    )}
                    {modelType === "embedding" && (
                      <Table
                        bordered
                        // pagination={false}
                        dataSource={data.embedding}
                        columns={[
                          {
                            dataIndex: "name",
                            key: "name",
                            title: "Model Name",
                            render: (text) => text || "Untitled Model",
                          },
                          {
                            dataIndex: "model_id",
                            title: "Model ID",
                            key: "model_id",
                            className: "text-gray-500",
                            render: (text) =>
                              text
                                .replace("dialoqbase_eb_", "")
                                .replace(/_dialoqbase_[0-9]+$/, ""),
                          },
                          {
                            dataIndex: "model_provider",
                            title: "Provider",
                            key: "model_provider",
                          },
                          {
                            title: "Action",
                            render: (record) =>
                              record.local_model ? (
                                <div className="flex flex-row gap-2">
                                  <Tooltip title="Hide Model from Users">
                                    <button
                                      type="button"
                                      disabled={isHide}
                                      onClick={() => {
                                        hide(record.id);
                                      }}
                                      className="text-gray-400 hover:text-gray-500"
                                    >
                                      {record.hide ? (
                                        <EyeSlashIcon className="h-5 w-5" />
                                      ) : (
                                        <EyeIcon className="h-5 w-5" />
                                      )}
                                    </button>
                                  </Tooltip>
                                  <Tooltip title="Delete Model">
                                    <button
                                      type="button"
                                      disabled={isDelete}
                                      onClick={() => {
                                        const confirm = window.confirm(
                                          "Are you sure you want to delete this model?"
                                        );

                                        if (confirm) {
                                          del(record.id);
                                        }
                                      }}
                                      className="text-red-400 hover:text-red-500"
                                    >
                                      <TrashIcon className="h-5 w-5" />
                                    </button>
                                  </Tooltip>
                                </div>
                              ) : (
                                <Tooltip title="Hide Model from Users">
                                  <button
                                    type="button"
                                    disabled={isHide}
                                    onClick={() => {
                                      hide(record.id);
                                    }}
                                    className="text-gray-400 hover:text-gray-500"
                                  >
                                    {record.hide ? (
                                      <EyeSlashIcon className="h-5 w-5" />
                                    ) : (
                                      <EyeIcon className="h-5 w-5" />
                                    )}
                                  </button>
                                </Tooltip>
                              ),
                          },
                        ]}
                      />
                    )}
                  </div>
                </div>
              </dl>
            </div>
          </div>

          <Modal
            open={openAddModel}
            footer={null}
            title="Add New Model"
            onCancel={() => {
              setOpenAddModel(false);
            }}
          >
            <LLMForm setOpenAddModel={setOpenAddModel} />
          </Modal>

          <Modal
            open={openAddEmbeddingModel}
            footer={null}
            title="Add New Embedding Model"
            onCancel={() => {
              setOpenAddEmbeddingModel(false);
            }}
          >
            <EMForm setOpenAddEmbeddingModel={setOpenAddEmbeddingModel} />
          </Modal>
        </>
      )}
    </SettingsLayout>
  );
}
