import { Form, InputNumber, Switch, notification, Select, Input } from "antd";
import React from "react";
import api from "../../services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { SettingsLayout } from "../../Layout/SettingsLayout";
import { SkeletonLoading } from "../../components/Common/SkeletonLoading";
import { useNavigate } from "react-router-dom";
import { ApplicationCard } from "../../components/Settings/Application/ApplicationCard";
import { useCreateConfig } from "../../hooks/useCreateConfig";

export default function SettingsApplicationRoot() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { data: models, status: modeStatus } = useCreateConfig();
  const queryClient = useQueryClient();

  const { data, status } = useQuery(["fetchApplicationSettings"], async () => {
    const response = await api.get("/admin/dialoqbase-settings");
    return response.data as {
      noOfBotsPerUser: number;
      allowUserToCreateBots: boolean;
      allowUserToRegister: boolean;
      defaultChunkSize: number;
      defaultChunkOverlap: number;
      defaultChatModel: string;
      defaultEmbeddingModel: string;
      hideDefaultModels: boolean;
      dynamicallyFetchOllamaModels: boolean;
      ollamaURL: string;
    };
  });

  React.useEffect(() => {
    if (status === "error") {
      navigate("/settings");
    }
  }, [status]);

  const onUpdateApplicatoon = async (values: any) => {
    const response = await api.post("/admin/dialoqbase-settings", values);
    return response.data;
  };

  const onRagApplicationUpdate = async (values: any) => {
    const response = await api.post("/admin/rag-settings", values);
    return response.data;
  };

  const { mutateAsync: updateApplicationSettings, isLoading } = useMutation(
    onUpdateApplicatoon,
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["fetchBotCreateConfig"]);
        notification.success({
          message: "Success",
          description: data.message,
        });
      },
      onError: (error: any) => {
        notification.error({
          message: "Error",
          description: error?.response?.data?.message || "Something went wrong",
        });
      },
    }
  );

  const { mutateAsync: updateModelSettings, isLoading: isModelLoading } =
    useMutation(onUpdateApplicatoon, {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["fetchBotCreateConfig"]);
        notification.success({
          message: "Success",
          description: data.message,
        });
      },
      onError: (error: any) => {
        notification.error({
          message: "Error",
          description: error?.response?.data?.message || "Something went wrong",
        });
      },
    });
  const { mutateAsync: updateRagSettings, isLoading: isRagLoading } =
    useMutation(onRagApplicationUpdate, {
      onSuccess: (data) => {
        notification.success({
          message: "Success",
          description: data.message,
        });
      },
      onError: (error: any) => {
        notification.error({
          message: "Error",
          description: error?.response?.data?.message || "Something went wrong",
        });
      },
    });

  return (
    <SettingsLayout>
      {status === "success" && (
        <div className="flex flex-col gap-6">
          <ApplicationCard
            title="Application Settings"
            description="Configure your application settings"
          >
            <Form
              form={form}
              initialValues={{
                ...data,
              }}
              layout="vertical"
              onFinish={updateApplicationSettings}
            >
              <div className="sm:overflow-hidden ">
                <div className="space-y-6 border-t border rounded-t-md  bg-white px-4 py-5 sm:p-6 dark:bg-[#171717] dark:border-gray-600">
                  <Form.Item
                    label="No of bots per user"
                    name="noOfBotsPerUser"
                    rules={[
                      {
                        required: true,
                        message: "Please input no of bots per user!",
                      },
                    ]}
                  >
                    <InputNumber size="large" style={{ width: "100%" }} />
                  </Form.Item>
                  <Form.Item
                    label="Allow user to create bots"
                    name="allowUserToCreateBots"
                    rules={[
                      {
                        required: true,
                        message: "Please input allow user to create bots!",
                      },
                    ]}
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  <Form.Item
                    label="Allow user to register"
                    name="allowUserToRegister"
                    rules={[
                      {
                        required: true,
                        message: "Please input allow user to register!",
                      },
                    ]}
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                  <Form.Item
                    label="Enhanced Website loader"
                    name="usePuppeteerFetch"
                    valuePropName="checked"
                  >
                    <Switch />
                  </Form.Item>
                </div>
                <div className="bg-gray-50 border-x border-b rounded-b-md rounded-x-md px-4 py-3 text-right sm:px-6 dark:bg-[#141414] dark:border-gray-600">
                  <button
                    disabled={isLoading}
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white  hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    {isLoading ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </Form>
          </ApplicationCard>

          <ApplicationCard
            title="Models Settings"
            description="Configure your models settings"
          >
            <Form
              initialValues={{
                ...data,
              }}
              layout="vertical"
              onFinish={updateModelSettings}
            >
              <div className="sm:overflow-hidden ">
                <div className="space-y-6 border-t border rounded-t-md  bg-white px-4 py-5 sm:p-6 dark:bg-[#171717] dark:border-gray-600">
                  <Form.Item
                    label="Default Chat Model"
                    name="defaultChatModel"
                    rules={[
                      {
                        required: true,
                        message: "Please select default chat model!",
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label?.toLowerCase() ?? "").includes(
                          input?.toLowerCase()
                        ) ||
                        (option?.value?.toLowerCase() ?? "").includes(
                          input?.toLowerCase()
                        )
                      }
                      filterSort={(optionA, optionB) =>
                        (optionA?.label ?? "")
                          .toLowerCase()
                          .localeCompare((optionB?.label ?? "").toLowerCase())
                      }
                      placeholder="Select a Chat Model"
                      options={models?.chatModel || []}
                      loading={modeStatus === "loading"}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Default Embedding Model"
                    name="defaultEmbeddingModel"
                    rules={[
                      {
                        required: true,
                        message: "Please select default embedding model!",
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label?.toLowerCase() ?? "").includes(
                          input?.toLowerCase()
                        ) ||
                        (option?.value?.toLowerCase() ?? "").includes(
                          input?.toLowerCase()
                        )
                      }
                      filterSort={(optionA, optionB) =>
                        (optionA?.label ?? "")
                          .toLowerCase()
                          .localeCompare((optionB?.label ?? "").toLowerCase())
                      }
                      placeholder="Select a Embedding Model"
                      options={models?.embeddingModel || []}
                      loading={modeStatus === "loading"}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Ollama URL"
                    name="ollamaURL"
                    rules={[
                      {
                        required: true,
                        message: "Please input ollama url!",
                      },
                    ]}
                  >
                    <Input size="large" placeholder="Enter ollama url" />
                  </Form.Item>

                  <Form.Item
                    label="Hide Default Models"
                    name="hideDefaultModels"
                    valuePropName="checked"
                    help="This will hide all the default models and only show the models that are locally added or from ollama."
                  >
                    <Switch />
                  </Form.Item>
                  <Form.Item
                    label="Dynamically Fetch Ollama Models"
                    name="dynamicallyFetchOllamaModels"
                    valuePropName="checked"
                    help="This will dynamically fetch the models from ollama. You don't need to manually add the models."
                  >
                    <Switch />
                  </Form.Item>
                </div>
                <div className="bg-gray-50 border-x border-b rounded-b-md rounded-x-md px-4 py-3 text-right sm:px-6 dark:bg-[#141414] dark:border-gray-600">
                  <button
                    disabled={isModelLoading}
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white  hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    {isModelLoading ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </Form>
          </ApplicationCard>

          <ApplicationCard
            title="RAG Settings"
            description="Configure your RAG settings"
          >
            <div className="sm:overflow-hidden ">
              <Form
                initialValues={{
                  defaultChunkSize: data.defaultChunkSize,
                  defaultChunkOverlap: data.defaultChunkOverlap,
                }}
                layout="vertical"
                onFinish={updateRagSettings}
              >
                <div className="space-y-6 border-t border rounded-t-md  bg-white px-4 py-5 sm:p-6 dark:bg-[#171717] dark:border-gray-600">
                  <Form.Item
                    label="Default Chunk Size"
                    name="defaultChunkSize"
                    rules={[
                      {
                        required: true,
                        message: "Please input default chunk size!",
                      },
                    ]}
                  >
                    <InputNumber size="large" style={{ width: "100%" }} />
                  </Form.Item>

                  <Form.Item
                    label="Default Chunk Overlap"
                    name="defaultChunkOverlap"
                    rules={[
                      {
                        required: true,
                        message: "Please input default chunk overlap!",
                      },
                    ]}
                  >
                    <InputNumber size="large" style={{ width: "100%" }} />
                  </Form.Item>
                </div>
                <div className="bg-gray-50 border-x border-b rounded-b-md rounded-x-md px-4 py-3 text-right sm:px-6 dark:bg-[#141414] dark:border-gray-600">
                  <button
                    disabled={isRagLoading}
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white  hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    {isRagLoading ? "Saving..." : "Save"}
                  </button>
                </div>
              </Form>
            </div>
          </ApplicationCard>
        </div>
      )}
      {status === "loading" && <SkeletonLoading />}

      {status === "error" && (
        <div className="text-center">Something went wrong</div>
      )}
    </SettingsLayout>
  );
}
