import { Form, Switch, Input, notification } from "antd";
import { useParams } from "react-router-dom";
import api from "../../../services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

type Props = {
  publicBotPwdProtected: boolean;
  publicBotPwd: string;
};

export const SettingsPwdP: React.FC<Props> = ({
  publicBotPwd,
  publicBotPwdProtected,
}) => {
  const params = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const isEnabled = Form.useWatch("publicBotPwdProtected", form);
  const client = useQueryClient();
  const onFinish = async (values: any) => {
    const response = await api.put(`/bot/${params.id}/password`, values);
    return response.data;
  };

  const { mutate, isLoading } = useMutation(onFinish, {
    onSuccess: () => {
      client.invalidateQueries(["getBotSettings", params.id]);

      notification.success({
        message: "Bot settings updated successfully",
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
  return (
    <Form
      form={form}
      initialValues={{
        publicBotPwdProtected,
        publicBotPwd,
      }}
      layout="vertical"
      onFinish={mutate}
    >
      <div className="px-4 py-5 bg-white  border sm:rounded-lg sm:p-6 dark:bg-[#1e1e1e] dark:border-gray-700">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              Password Protection
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Proctect bot's public access with a password.
            </p>
          </div>
          <div className="mt-5 space-y-6 md:col-span-2 md:mt-0">
            <Form.Item
              name="publicBotPwdProtected"
              valuePropName="checked"
              label="Enable Password Protection"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="publicBotPwd"
              label="Password"
              rules={[
                {
                  required: isEnabled,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password
                placeholder="Password"
                disabled={!isEnabled}
                size="large"
              />
            </Form.Item>

            <div className="text-sm text-gray-500 dark:text-gray-400">
              This feature is in preview and only works with web interface for
              now
            </div>
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
  );
};
