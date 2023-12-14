import React from "react";
import { BotIntegrationAPI } from "../../../../@types/bot";
import { CopyBtn } from "../../../Common/CopyBtn";
import { Form, Input, Select, Switch, Tooltip, notification } from "antd";
import { ArrowPathIcon, MinusIcon } from "@heroicons/react/24/outline";
import APICodeGenerator from "./APICodeGenerator";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiResponse } from "./ApiResponse";
import api from "../../../../services/api";
import { useParams } from "react-router-dom";
const ApiPlaygroundComponent: React.FC<BotIntegrationAPI> = ({ data }) => {
  const [form] = Form.useForm();

  const message = Form.useWatch("message", form);

  const history = Form.useWatch("history", form);

  const stream = Form.useWatch("stream", form);

  const client = useQueryClient();

  const param = useParams<{ id: string }>();

  const [hostUrl] = React.useState<string>(
    () =>
      import.meta.env.VITE_HOST_URL ||
      window.location.protocol + "//" + window.location.host
  );
  const { mutate: regenerateAPIKey, isLoading: isGeneratingAPIKey } =
    useMutation(
      async () => {
        const response = await api.put(`/bot/integration/${param.id}/api`);
        return response.data;
      },
      {
        onSuccess: () => {
          notification.success({
            message: "Success",
            description: "API key re-generated successfully.",
          });
          client.invalidateQueries(["getBotIntegrationAPI"]);
        },
        onError: (e) => {
          console.log(e);
          notification.error({
            message: "Error",
            description:
              "Something went wrong while re-generating the API key.",
          });
        },
      }
    );

  const [apiResponse, setApiResponse] = React.useState<any>(null);

  const handleSubmit = async (values: any) => {
    try {
      const res = await axios.post(
        `${hostUrl}/bot/${data.public_url}/api`,
        values,
        {
          headers: {
            "content-type": "application/json",
            "x-api-key": `${data.api_key}`,
          },
        }
      );
      return {
        data: res.data,
        status: res.status,
      };
    } catch (err: any) {
      return {
        data: err?.response?.data,
        status: err?.response?.status || 500,
      };
    }
  };

  const { mutate: showResponse, isLoading } = useMutation(handleSubmit, {
    onSuccess: (data) => {
      setApiResponse(data);
    },
  });

  return (
    <div className="min-h-screen ">
      <div className="bg-white border rounded-md p-4 max-w-screen-xl mx-auto dark:bg-[#0a0a0a] dark:border-[#232222]">
        <div className="flex mb-4">
          {/* span green [POST] tailwind */}
          <div className="flex-1">
            <Input
              size="large"
              type="text"
              readOnly
              value={`${hostUrl}/bot/${data.public_url}/api`}
              // className="block w-full rounded-md border-gray-200 focus:border-sky-500 focus:ring-sky-500 sm:text-sm bg-gray-50"
            />
          </div>
          <div className="flex flex-row gap-2">
            <CopyBtn
              showText={false}
              value={`${hostUrl}/bot/${data.public_url}/api`}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-md p-4 dark:bg-[#0a0a0a] dark:border-[#232222]">
            <h6 className="text-sm font-semibold mb-2 dark:text-gray-300">
              API KEY
            </h6>
            <div className="flex flex-row mb-2">
              <Input
                size="large"
                type="text"
                readOnly
                value={data.api_key || ""}
              />
              <CopyBtn showText={false} value={data.api_key || ""} />
              <Tooltip title="Regenerate API Key">
                <button
                  onClick={() => !isGeneratingAPIKey && regenerateAPIKey()}
                  className={isGeneratingAPIKey ? "animate-spin" : ""}
                >
                  <ArrowPathIcon className="h-5 w-5 text-gray-500" />
                </button>
              </Tooltip>
            </div>

            <h6 className="text-sm font-semibold mb-2 dark:text-gray-300">
              BODY PARAMS
            </h6>

            <Form
              form={form}
              layout="vertical"
              onFinish={showResponse}
              initialValues={{
                stream: true,
                history: [],
                message: "",
              }}
            >
              <Form.Item
                label={
                  <span className="text-sm font-semibold mb-2">
                    message
                    <span className="ml-2 text-xs text-gray-500 font-normal">
                      string
                    </span>
                  </span>
                }
                rules={[
                  {
                    required: true,
                    message: "field 'message' is required by the API",
                  },
                ]}
                name="message"
              >
                <Input
                  size="large"
                  type="text"
                  placeholder="Enter your message here"
                />
              </Form.Item>

              <Form.List name="history">
                {(fields, { add, remove }) => (
                  <div className="bg-gray-50 p-3 rounded-md border mb-6 dark:bg-[#0a0a0a] dark:border-[#232222]">
                    <div className="text-sm font-semibold mb-3">
                      history
                      <span className="ml-2 text-xs text-gray-500 font-normal">
                        array
                      </span>
                    </div>
                    {fields.map((field, index) => (
                      <div
                        key={index}
                        className="border p-2 rounded mb-2 dark:bg-[#0a0a0a] dark:border-[#232222]"
                      >
                        <div className="flex flex-row justify-between">
                          <div>
                            <span className="text-sm font-semibold mb-2">
                              {"Object"}
                            </span>
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={() => remove(field.name)}
                            >
                              <MinusIcon className="w-6 h-6 mr-1 text-gray-500" />
                            </button>
                          </div>
                        </div>
                        <Form.Item
                          label={
                            <span className="text-sm font-semibold mb-2">
                              role
                              <span className="ml-2 text-xs text-gray-500 font-normal">
                                string
                              </span>
                            </span>
                          }
                          required={true}
                          key={field.key}
                          name={[field.name, "role"]}
                          help="The role of the messages author. One of ai or human."
                        >
                          <Select
                            placeholder="Select a type"
                            options={[
                              {
                                label: "human",
                                value: "human",
                              },
                              {
                                label: "ai",
                                value: "ai",
                              },
                            ]}
                          />
                        </Form.Item>

                        <Form.Item
                          label={
                            <span className="text-sm font-semibold mb-2">
                              text
                              <span className="ml-2 text-xs text-gray-500 font-normal">
                                string
                              </span>
                            </span>
                          }
                          required={true}
                          key={field.key}
                          name={[field.name, "text"]}
                          help="The text of the message. text is required for all messages."
                        >
                          <Input
                            size="large"
                            placeholder="Enter your message here"
                          />
                        </Form.Item>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() =>
                        add({
                          role: "",
                          text: "",
                        })
                      }
                      className="flex items-center justify-center p-2 transition-colors duration-200 rounded hover:bg-gray-100 focus:outline-none focus:ring focus:ring-opacity-50 dark:hover:bg-gray-800 dark:focus:ring-gray-900"
                    >
                      <span className="text-blue-800">Add history</span>
                    </button>
                  </div>
                )}
              </Form.List>

              <Form.Item
                label={
                  <span className="text-sm font-semibold mb-2">
                    stream
                    <span className="ml-2 text-xs text-gray-500 font-normal">
                      boolean
                    </span>
                  </span>
                }
                name="stream"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <div className="flex flex-row justify-end">
                <button
                  type="submit"
                  className="inline-flex  justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white  hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  {isLoading ? "Loading..." : "Test API"}
                </button>
              </div>
            </Form>
          </div>

          <div className="border rounded-md p-4 dark:bg-[#0a0a0a] dark:border-[#232222]">
            <APICodeGenerator
              api={`${hostUrl}/bot/${data.public_url}/api`}
              xApiKey={data.api_key || ""}
              body={JSON.stringify(
                {
                  message,
                  history,
                  stream,
                },
                null,
                2
              )}
            />

            {/* divider */}
            <div className="border-t border-gray-200 my-4"></div>

            {apiResponse && (
              <ApiResponse
                status={apiResponse.status}
                data={JSON.stringify(apiResponse.data, null, 2)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiPlaygroundComponent;
