import {
  Form,
  Switch,
  Table,
  Tag,
  Modal,
  notification,
  Select,
  Tooltip,
  Input,
} from "antd";
import React from "react";
import api from "../../services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { SettingsLayout } from "../../Layout/SettingsLayout";
import { SkeletonLoading } from "../../components/Common/SkeletonLoading";
import { useNavigate } from "react-router-dom";
import { GetAllModelResponse } from "../../@types/settings";
import { EyeIcon, EyeSlashIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function SettingsModelRoot() {
  const navigate = useNavigate();
  const [openAddModel, setOpenAddModel] = React.useState(false);
  const [fetchUrlForm] = Form.useForm();
  const apiType = Form.useWatch("api_type", fetchUrlForm);
  const [form] = Form.useForm();
  const client = useQueryClient();

  const [type, setType] = React.useState<"url" | "save">("url");
  const [localModels, setLocalModels] = React.useState<
    {
      id: string;
      object: string;
    }[]
  >([]);
  const { data, status } = useQuery(["fetchAllModels"], async () => {
    const response = await api.get("/admin/models");
    return response.data as GetAllModelResponse;
  });

  React.useEffect(() => {
    if (status === "error") {
      navigate("/settings");
    }
  }, [status]);

  const fetchLocalModels = async (body: {
    url: string;
    api_key?: string;
    api_type?: string;
    ollama_url?: string;
  }) => {
    const response = await api.post("/admin/models/fetch", body);
    return response.data as {
      data: {
        id: string;
        object: string;
      }[];
    };
  };

  const { isLoading: isSaveModel, mutate: fetchModel } = useMutation(
    fetchLocalModels,
    {
      onSuccess: (data) => {
        setLocalModels(data.data);
        setType("save");
      },
      onError: (e: any) => {
        const message = e?.response?.data?.message || "Something went wrong";
        notification.error({
          message,
        });
      },
    }
  );

  const saveLocalModel = async (values: any) => {
    const response = await api.post("/admin/models", {
      ...values,
      url: fetchUrlForm.getFieldValue("url") || fetchUrlForm.getFieldValue("ollama_url"),
      api_key: fetchUrlForm.getFieldValue("api_key"),
      api_type: fetchUrlForm.getFieldValue("api_type"),
    });
    return response.data;
  };

  const { mutate: saveModel, isLoading: isSaveLocalModel } = useMutation(
    saveLocalModel,
    {
      onSuccess: () => {
        notification.success({
          message: "Model saved successfully",
        });
        client.invalidateQueries(["fetchAllModels"]);
        setOpenAddModel(false);
        form.resetFields();
        fetchUrlForm.resetFields();
        setType("url");
      },
      onError: (e: any) => {
        const message = e?.response?.data?.message || "Something went wrong";
        notification.error({
          message,
        });
      },
    }
  );

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
                <button
                  type="button"
                  onClick={() => setOpenAddModel(true)}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add New Model
                </button>
              </div>
              <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-200">
                Manage all the AI models in your organization.
              </p>

              <dl className="mt-6 space-y-6 divide-y divide-gray-100   text-sm leading-6 ">
                <div className="mt-5 md:col-span-2 md:mt-0">
                  <Table
                    // pagination={false}
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
                </div>
              </dl>
            </div>
          </div>

          <Modal
            open={openAddModel}
            footer={null}
            title="Add New Model"
            onCancel={() => setOpenAddModel(false)}
          >
            {type === "url" && (
              <Form
                form={fetchUrlForm}
                layout="vertical"
                onFinish={(value) => {
                  fetchModel(value)
                }}
                initialValues={{
                  api_type: "openai",
                  ollama_url: "http://localhost:11434",
                }}
              >
                {apiType === "openai" && (
                  <>
                    <Form.Item
                      help={
                        <p className="text-sm mb-6 text-gray-500">
                          {
                            "We support models that are OpenAI API compatible, such as "
                          }
                          <a
                            href="https://github.com/go-skynet/LocalAI"
                            className="text-indigo-600"
                          >
                            LocalAI
                          </a>
                          .
                        </p>
                      }
                      name="url"
                      label="URL"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input
                        size="large"
                        type="url"
                        placeholder="http://localhost:5000/v1"
                      />
                    </Form.Item>

                    <Form.Item name="api_key" label="API Key (Optional)">
                      <Input.Password
                        size="large"
                        type="text"
                        placeholder="Enter API Key (Optional)"
                      />
                    </Form.Item>
                  </>
                )}

                {apiType === "ollama" && (
                  <Form.Item
                    name="ollama_url"
                    label="URL"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input
                      size="large"
                      type="url"
                      placeholder="http://localhost:11434"
                    />
                  </Form.Item>
                )}

                <Form.Item name={"api_type"} label="API Type">
                  <Select
                    size="large"
                    placeholder="Select API Type"
                    options={[
                      {
                        label: "OpenAI Compatible API",
                        value: "openai",
                      },
                      {
                        label: "Ollama",
                        value: "ollama",
                      },
                    ]}
                  />
                </Form.Item>

                <button
                  type="submit"
                  disabled={isSaveModel}
                  className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  {!isSaveModel ? "Fetch Model" : "Fetching Model..."}
                </button>
              </Form>
            )}

            {type === "save" && (
              <Form
                initialValues={{
                  stream_available: true,
                }}
                form={form}
                layout="vertical"
                onFinish={(value) => {
                  saveModel(value);
                }}
              >
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Please enter a model name",
                    },
                  ]}
                  name="name"
                  label="Model Name"
                >
                  <Input size="large" placeholder="Enter a model name" />
                </Form.Item>

                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: "Please select a model",
                    },
                  ]}
                  name="model_id"
                  label="Model ID"
                >
                  <Select
                    placeholder="Select a model"
                    size="large"
                    showSearch
                    filterOption={(input, option) =>
                      (option?.label ?? "").includes(input)
                    }
                    filterSort={(optionA, optionB) =>
                      (optionA?.label ?? "")
                        .toLowerCase()
                        .localeCompare((optionB?.label ?? "").toLowerCase())
                    }
                    options={localModels.map((item) => {
                      return {
                        label: item.id,
                        value: item.id,
                      };
                    })}
                  />
                </Form.Item>

                <Form.Item
                  name="stream_available"
                  label="Is Streaming Available?"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>

                <button
                  disabled={isSaveLocalModel}
                  type="submit"
                  className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  {!isSaveLocalModel ? "Save Model" : "Saving Model..."}
                </button>
              </Form>
            )}
          </Modal>
        </>
      )}
    </SettingsLayout>
  );
}
