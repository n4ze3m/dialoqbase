import { Divider, Form, notification } from "antd";
import { Switch } from "@headlessui/react";
import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../services/api";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { ClipboardIcon } from "@heroicons/react/24/outline";
// import Switch from antd as AntdSwitch
import { Switch as AntdSwitch } from "antd";

//@ts-ignore
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
type Props = {
  onClose: () => void;
  data: {
    name: string;
    channel: string;
    logo: string;
    description: string;
    link: string;
    fields: {
      name: string;
      type: string;
      title: string;
      description: string;
      inputType: string;
      help: string;
      requiredMessage: string;
      value: string;
    }[];
    isPaused: boolean;
    status: string;
    color: string;
    textColor: string;
    connectBtn?: {
      text: string;
      link: string;
    } | null;
  };
};

export const IntegrationForm: React.FC<Props> = ({ onClose, data }) => {
  const [enabled, setEnabled] = React.useState(!data.isPaused);
  const params = useParams<{ id: string }>();

  const onSubmit = async (value: any) => {
    const response = await api.post(`/bot/integration/${params.id}`, {
      provider: data.channel,
      value,
    });
    return response.data;
  };

  const client = useQueryClient();

  const { mutate: updateIntegration, isLoading: isUpdating } = useMutation(
    onSubmit,
    {
      onSuccess: () => {
        client.invalidateQueries(["getBotEIntegration", params.id]);
        notification.success({
          message: "Success",
          description: "Integration updated successfully",
        });
        onClose();
      },
      onError: (e: any) => {
        if (axios.isAxiosError(e)) {
          const message =
            e.response?.data?.message ||
            e?.response?.data?.error ||
            e.message ||
            "Something went wrong";
          notification.error({
            message: "Error",
            description: message,
          });
          return;
        }

        notification.error({
          message: "Error",
          description: e.message || "Something went wrong",
        });
      },
    }
  );

  const [hostUrl] = React.useState<string>(
    () =>
      import.meta.env.VITE_HOST_URL ||
      window.location.protocol + "//" + window.location.host
  );
  const { mutate: toggleIntegration, isLoading: isToggling } = useMutation(
    async () => {
      const response = await api.post(`/bot/integration/${params.id}/toggle`, {
        provider: data.channel,
      });
      return response.data;
    },
    {
      onSuccess: () => {
        client.invalidateQueries(["getBotEIntegration", params.id]);
        notification.success({
          message: "Success",
          description: "Integration toggled successfully",
        });
        onClose();
      },
      onError: (e: any) => {
        if (axios.isAxiosError(e)) {
          const message =
            e.response?.data?.message ||
            e?.response?.data?.error ||
            e.message ||
            "Something went wrong";
          notification.error({
            message: "Error",
            description: message,
          });
          return;
        }

        notification.error({
          message: "Error",
          description: e.message || "Something went wrong",
        });
      },
    }
  );

  return (
    <>
      <Form
        initialValues={{
          ...data.fields.reduce((acc, field) => {
            //@ts-ignore
            acc[field.name] = field.value;
            return acc;
          }, {}),
        }}
        layout="vertical"
        className="space-y-6"
        onFinish={updateIntegration}
      >
        {data.fields.map((field, index) => {
          if (field.type === "webhook") {
            return (
              <Form.Item key={index} label={field.title} name={field.name}>
                <div className="flex">
                  <div className="relative flex-grow focus-within:z-10">
                    <input
                      readOnly
                      value={`${hostUrl}/api/v1/bot/integration/${params.id}/whatsapp`}
                      type={field.inputType}
                      placeholder={field.help}
                      className="border border-gray-300 rounded-md text-gray-400 px-4 py-2 w-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex-shrink-0 ml-3">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${hostUrl}/api/v1/bot/integration/${params.id}/whatsapp`
                        );
                        notification.success({
                          message: "Copied!",
                          placement: "bottomRight",
                        });
                      }}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                    >
                      <ClipboardIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </Form.Item>
            );
          } else if (field.inputType === "boolean") {
            return (
              <Form.Item
                key={index}
                label={field.title}
                name={field.name}
                valuePropName="checked"
              >
                <AntdSwitch />
              </Form.Item>
            );
          }

          return (
            <Form.Item
              key={index}
              label={field.title}
              name={field.name}
              rules={[{ required: true, message: field.requiredMessage }]}
            >
              <input
                type={field.inputType}
                placeholder={field.help}
                className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </Form.Item>
          );
        })}

        <Form.Item>
          <button
            type="submit"
            disabled={isUpdating || isToggling}
            className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {isUpdating ? "Saving..." : "Save"}
          </button>
        </Form.Item>
      </Form>
      <Divider />
      <div
        className={
          data?.connectBtn ? "flex items-center justify-between space-x-3" : ""
        }
      >
        <Switch.Group
          as="div"
          className="flex items-center justify-between space-x-3"
        >
          <Switch.Label as="span" className="ml-3">
            <span className="text-sm font-medium text-gray-600">
              Enable integration
            </span>
          </Switch.Label>
          <Switch
            disabled={
              data.status.toLowerCase() === "connect" ||
              isToggling ||
              isUpdating
            }
            checked={enabled}
            onChange={(e) => {
              setEnabled(e);
              toggleIntegration();
            }}
            className={classNames(
              enabled ? "bg-indigo-600" : "bg-gray-200",
              "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            )}
          >
            <span
              aria-hidden="true"
              className={classNames(
                enabled ? "translate-x-5" : "translate-x-0",
                "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
              )}
            />
          </Switch>
        </Switch.Group>
        {data.connectBtn && (
          <Link to={data.connectBtn.link} target="_blank">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
            >
              {data.connectBtn.text}
            </button>
          </Link>
        )}
      </div>
    </>
  );
};
