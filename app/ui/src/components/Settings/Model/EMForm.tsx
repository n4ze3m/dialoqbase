import React from "react";
import api from "../../../services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, Input, Select, notification } from "antd";

type Props = {
  setOpenAddEmbeddingModel: React.Dispatch<React.SetStateAction<boolean>>;
};

export const EMForm: React.FC<Props> = ({ setOpenAddEmbeddingModel }) => {
  const client = useQueryClient();

  const [embeddingForm] = Form.useForm();
  const [embeddingType, setEmbeddingType] = React.useState<
    "openai" | "ollama" | "transformer"
  >("openai");

  const saveEmbeddingModelApi = async (values: any) => {
    const response = await api.post("/admin/models/embedding", {
      ...values,
      url: embeddingForm.getFieldValue("url"),
      api_key: embeddingForm.getFieldValue("api_key"),
      api_type: embeddingType,
    });
    return response.data;
  };

  const { mutate: saveEmbeddingModel, isLoading: isSaveEmeddingModel } =
    useMutation(saveEmbeddingModelApi, {
      onSuccess: () => {
        notification.success({
          message: "Model saved successfully",
        });
        client.invalidateQueries(["fetchAllModels"]);
        setOpenAddEmbeddingModel(false);
        embeddingForm.resetFields();
        setEmbeddingType("openai");
      },
      onError: (e: any) => {
        const message = e?.response?.data?.message || "Something went wrong";
        notification.error({
          message,
        });
      },
    });

  return (
    <>
      <Select
        size="large"
        disabled={isSaveEmeddingModel}
        value={embeddingType}
        style={{ width: "100%" }}
        placeholder="Select Embedding Type"
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
            label: "Transformer Models",
            value: "transformer",
          },
        ]}
        onChange={(value) => {
          setEmbeddingType(value);
        }}
      />

      <div className="mt-4">
        {embeddingType === "openai" && (
          <Form
            onFinish={(value) => {
              saveEmbeddingModel(value);
            }}
            form={embeddingForm}
            layout="vertical"
          >
            <Form.Item
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

            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Please enter a model name",
                },
              ]}
              name="model_name"
              label="Model Name"
            >
              <Input size="large" placeholder="Enter a model name" />
            </Form.Item>

            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Please enter a model ID",
                },
              ]}
              name="model_id"
              label="Model ID"
            >
              <Input size="large" placeholder="Enter a model ID" />
            </Form.Item>

            <button
              type="submit"
              disabled={isSaveEmeddingModel}
              className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {!isSaveEmeddingModel ? "Save Model" : "Saving Model..."}
            </button>
          </Form>
        )}

        {embeddingType === "ollama" && (
          <Form
            onFinish={(value) => {
              saveEmbeddingModel(value);
            }}
            form={embeddingForm}
            layout="vertical"
            initialValues={{
              url: "http://host.docker.internal:11434",
            }}
          >
            <Form.Item
              name="url"
              label="URL"
              rules={[
                {
                  required: true,
                  message: "Please enter Ollama URL",
                },
              ]}
            >
              <Input
                size="large"
                type="url"
                placeholder="http://localhost:11434"
              />
            </Form.Item>

            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Please enter a model name",
                },
              ]}
              name="model_name"
              label="Model Name"
            >
              <Input size="large" placeholder="Enter a model name" />
            </Form.Item>

            <Form.Item
              help={<p className="text-sm mb-6 text-gray-500">{"llama2"}</p>}
              rules={[
                {
                  required: true,
                  message: "Please enter a model ID",
                },
              ]}
              name="model_id"
              label="Model ID"
            >
              <Input size="large" placeholder="Enter a model ID" />
            </Form.Item>

            <button
              type="submit"
              disabled={isSaveEmeddingModel}
              className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {!isSaveEmeddingModel ? "Save Model" : "Saving Model..."}
            </button>
          </Form>
        )}

        {embeddingType === "transformer" && (
          <Form
            onFinish={(value) => {
              saveEmbeddingModel(value);
            }}
            form={embeddingForm}
            layout="vertical"
          >
            <Form.Item
              rules={[
                {
                  required: true,
                  message: "Please enter a model name",
                },
              ]}
              name="model_name"
              label="Model Name"
            >
              <Input size="large" placeholder="Enter a model name" />
            </Form.Item>

            <Form.Item
              help={
                <p className="text-sm mb-6 text-gray-500">
                  {"WhereIsAI/UAE-Large-V1"}
                </p>
              }
              rules={[
                {
                  required: true,
                  message: "Please enter a model ID",
                },
              ]}
              name="model_id"
              label="Model ID"
            >
              <Input size="large" placeholder="Enter a model ID" />
            </Form.Item>

            <button
              type="submit"
              disabled={isSaveEmeddingModel}
              className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {!isSaveEmeddingModel ? "Save Model" : "Saving Model..."}
            </button>
          </Form>
        )}
      </div>
    </>
  );
};
