import { Form, notification, Select, Slider, Switch } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import {
  HELPFUL_ASSISTANT_WITH_CONTEXT_PROMPT,
  HELPFUL_ASSISTANT_WITHOUT_CONTEXT_PROMPT,
} from "../../../utils/prompts";
import { BotSettings } from "../../../@types/bot";

export const SettingsCard: React.FC<BotSettings> = ({
  data,
  chatModel,
  embeddingModel,
}) => {
  const [form] = Form.useForm();
  const [disableStreaming, setDisableStreaming] = React.useState(false);
  const params = useParams<{ id: string }>();

  const client = useQueryClient();

  const onFinish = async (values: any) => {
    const response = await api.put(`/bot/${params.id}`, values);
    return response.data;
  };

  const { mutate: updateBotSettings, isLoading } = useMutation(onFinish, {
    onSuccess: () => {
      client.invalidateQueries(["getBotSettings", params.id]);

      notification.success({
        message: "Bot updated successfully",
      });
    },
    onError: (error: any) => {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Something went wrong";
        notification.error({
          message,
        });
        return;
      }
      notification.error({
        message: "Something went wrong",
      });
    },
  });

  const navigate = useNavigate();

  const onDelete = async () => {
    const response = await api.delete(`/bot/${params.id}`);
    return response.data;
  };

  const { mutate: deleteBot, isLoading: isDeleting } = useMutation(onDelete, {
    onSuccess: () => {
      client.invalidateQueries(["getAllBots"]);

      navigate("/");

      notification.success({
        message: "Bot deleted successfully",
      });
    },
    onError: (error: any) => {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Something went wrong";
        notification.error({
          message,
        });
        return;
      }

      notification.error({
        message: "Something went wrong",
      });
    },
  });

  const embeddingType = Form.useWatch("embedding", form);
  const currentModel = Form.useWatch("model", form);

  const isStreamingSupported = (model: string) => {
    return chatModel.find((m) => m.value === model)?.stream === true;
  };

  React.useEffect(() => {
    if (!isStreamingSupported(currentModel) && currentModel) {
      form.setFieldsValue({
        streaming: false,
      });
      setDisableStreaming(true);
    } else {
      setDisableStreaming(false);
      form.setFieldsValue({
        streaming: true,
      });
    }
  }, [currentModel]);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
          <p className="mt-2 text-sm text-gray-700">
            Configure your bot settings.
          </p>
        </div>
      </div>
      {/* centerize the div */}
      <div className="mt-6 space-y-3">
        <Form
          initialValues={{
            name: data.name,
            model: data.model,
            temperature: data.temperature,
            embedding: data.embedding,
            qaPrompt: data.qaPrompt,
            questionGeneratorPrompt: data.questionGeneratorPrompt,
            streaming: data.streaming,
            showRef: data.showRef,
            use_hybrid_search: data.use_hybrid_search,
            bot_protect: data.bot_protect,
            use_rag: data.use_rag,
            bot_model_api_key: data.bot_model_api_key,
          }}
          form={form}
          requiredMark={false}
          onFinish={updateBotSettings}
          layout="vertical"
          className="space-y-6 mb-6 "
        >
          <div className="px-4 py-5 bg-white  border sm:rounded-lg sm:p-6">
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  General Settings
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Bot general settings and information.
                </p>
              </div>
              <div className="mt-5 space-y-6 md:col-span-2 md:mt-0">
                <Form.Item
                  name="name"
                  label="Project Name"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Project Name!",
                    },
                  ]}
                >
                  <input
                    type="text"
                    className="mt-1 block w-full sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                  />
                </Form.Item>

                <Form.Item
                  name="model"
                  label="Model"
                  rules={[
                    {
                      required: true,
                      message: "Please select a model!",
                    },
                  ]}
                >
                  <Select options={chatModel} />
                </Form.Item>

                <Form.Item
                  hasFeedback={!isStreamingSupported(currentModel)}
                  help={
                    !isStreamingSupported(currentModel) &&
                    "Streaming is not supported for this model."
                  }
                  name="streaming"
                  label="Streaming"
                  valuePropName="checked"
                >
                  <Switch disabled={disableStreaming} />
                </Form.Item>

                <Form.Item
                  name="showRef"
                  label="Cite sources in the chat"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>

                <Form.Item
                  name="temperature"
                  label="Temperature"
                  rules={[
                    {
                      required: true,
                      message: "Please select a temperature!",
                    },
                  ]}
                >
                  <Slider
                    min={0}
                    max={1}
                    step={0.1}
                    className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="font-medium text-gray-800 text-sm">
                      Embedding model
                    </span>
                  }
                  name="embedding"
                  hasFeedback={embeddingType === "tensorflow"}
                  help={
                    embeddingType === "tensorflow"
                      ? "TensorFlow embeddings can be slow and memory-intensive."
                      : null
                  }
                  validateStatus={
                    embeddingType === "tensorflow" ? "warning" : undefined
                  }
                >
                  <Select
                    disabled
                    placeholder="Select an embedding method"
                    options={embeddingModel}
                  />
                </Form.Item>

                <Form.Item
                  label={
                    <span className="font-medium text-gray-800 text-sm">
                      Question Answering Prompt (System Prompt)
                    </span>
                  }
                  name="qaPrompt"
                  rules={[
                    {
                      required: true,
                      message: "Please input a prompt!",
                    },
                  ]}
                >
                  <textarea
                    className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                    rows={5}
                    placeholder=""
                  />
                </Form.Item>
                <div className="flex flex-row justify-start gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      form.setFieldsValue({
                        qaPrompt: HELPFUL_ASSISTANT_WITH_CONTEXT_PROMPT,
                      });
                    }}
                    className="flex items-center rounded-md py-[0.4375rem] pl-2 pr-2 lg:pr-3 bg-white border text-xs"
                  >
                    PROMPT WITH CONTEXT
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      form.setFieldsValue({
                        qaPrompt: HELPFUL_ASSISTANT_WITHOUT_CONTEXT_PROMPT,
                      });
                    }}
                    className="flex items-center rounded-md py-[0.4375rem] pl-2 pr-2 lg:pr-3 bg-white border text-xs"
                  >
                    PROMPT WITHOUT CONTEXT
                  </button>
                </div>

                <Form.Item
                  label={
                    <span className="font-medium text-gray-800 text-sm">
                      Question Generator Prompt
                    </span>
                  }
                  name="questionGeneratorPrompt"
                  rules={[
                    {
                      required: true,
                      message: "Please input a prompt!",
                    },
                  ]}
                >
                  <textarea
                    className="mt-1 block w-full sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                    rows={5}
                    placeholder=""
                  />
                </Form.Item>

                <Form.Item
                  name="use_hybrid_search"
                  label="Use Hybrid Search Retrieval"
                  valuePropName="checked"
                  tooltip="This will use the hybrid search retrieval method instead of the default semantic search retrieval method. Only work on playground ui."
                >
                  <Switch />
                </Form.Item>
                <Form.Item
                  name="bot_protect"
                  label="Activate Public Bot Protection"
                  valuePropName="checked"
                  tooltip="This will activate the public bot protection using session to avoid misuse of the bot"
                >
                  <Switch />
                </Form.Item>

                <Form.Item
                  name="bot_model_api_key"
                  label="Chat Model API Key"
                  help="Enter your API key here. If you don't have one, you can leave this field blank."
                  tooltip="Enter your API key to use your own chat model. Currently, only OpenAI API keys are supported."
                >
                  <input
                    type="password"
                    className="mt-1 block w-full sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                  />
                </Form.Item>
              </div>
            </div>

            <div className="mt-3 text-right">
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white  hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </Form>

        <div className="bg-white border sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Delete your bot
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>
                This action cannot be undone. This will permanently delete your
                bot and all of its data.
              </p>
            </div>
            <div className="mt-5">
              <button
                onClick={() => {
                  const confirm = window.confirm(
                    "Are you sure you want to delete this bot?"
                  );
                  if (confirm) {
                    deleteBot();
                  }
                }}
                type="button"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:text-sm"
              >
                {isDeleting ? "Deleting..." : "Delete bot"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
