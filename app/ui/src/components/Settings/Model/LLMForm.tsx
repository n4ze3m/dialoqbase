import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Input, Select, Switch, notification } from "antd";
import React from "react";
import api from "../../../services/api";

type Props = {
  setOpenAddModel: React.Dispatch<React.SetStateAction<boolean>>;
};

export const LLMForm: React.FC<Props> = ({ setOpenAddModel }) => {
  const [fetchUrlForm] = Form.useForm();
  const [form] = Form.useForm();
  const client = useQueryClient();
  const apiType = Form.useWatch("api_type", fetchUrlForm);
  const [type, setType] = React.useState<"url" | "save">("url");
  const [localModels, setLocalModels] = React.useState<
    {
      id: string;
      object: string;
    }[]
  >([]);

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
      url:
        fetchUrlForm.getFieldValue("url") ||
        fetchUrlForm.getFieldValue("ollama_url"),
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

  return (
    <>
      {type === "url" && (
        <Form
          form={fetchUrlForm}
          layout="vertical"
          onFinish={(value) => {
            if (apiType === "replicate") {
              saveModel(value);
            } else {
              fetchModel(value);
            }
          }}
          initialValues={{
            api_type: "openai",
            ollama_url: "http://host.docker.internal:11434",
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

          {apiType === "replicate" && (
            <>
              <Form.Item
                name="api_key"
                label="Replicate API Key"
                rules={[
                  {
                    required: true,
                    message: "Please your Replicate API Key",
                  },
                ]}
              >
                <Input.Password
                  size="large"
                  type="text"
                  placeholder="Enter API Key"
                />
              </Form.Item>

              <Form.Item
                name="model_id"
                label="Model"
                rules={[
                  {
                    required: true,
                    message: "Please enter a replicate model id",
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder="mistralai/mixtral-8x7b-instruct-v0.1"
                />
              </Form.Item>

              <Form.Item
                name="stream_available"
                label="Is Streaming Available?"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </>
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
                {
                  label: "Replicate",
                  value: "replicate",
                },
              ]}
            />
          </Form.Item>

          <button
            type="submit"
            disabled={isSaveModel}
            className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {apiType === "replicate"
              ? !isSaveLocalModel
                ? "Save Model"
                : "Saving Model..."
              : !isSaveModel
              ? "Fetch Models"
              : "Fetching Models..."}
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
    </>
  );
};
