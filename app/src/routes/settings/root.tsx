import { Form, notification } from "antd";
import { useAuth } from "../../context/AuthContext";
import React from "react";
import api from "../../services/api";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export default function SettingsRoot() {
  const { profile } = useAuth();

  const [form] = Form.useForm();

  React.useEffect(() => {
    form.setFieldsValue({
      username: profile?.username,
    });
  }, [profile]);

  const onUpdateUsername = async (values: any) => {
    const response = await api.post("/user/update-username", values);
    return response.data;
  };

  const { mutateAsync: updateUsername, isLoading } = useMutation(
    onUpdateUsername,
    {
      onSuccess: () => {
        notification.success({
          message: "Success",
          description: "Username updated",
        });
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          const message = error.response?.data?.message;
          notification.error({
            message: "Error",
            description: message,
          });
          return;
        }

        notification.error({
          message: "Error",
          description: "Something went wrong",
        });
      },
    }
  );

  const onUpdatePassword = async (values: any) => {
    const response = await api.post("/user/update-password", values);
    return response.data;
  };

  const { mutateAsync: updatePassowrd, isLoading: isPasswordLoading } =
    useMutation(onUpdatePassword, {
      onSuccess: () => {
        notification.success({
          message: "Success",
          description: "Password updated",
        });
      },
      onError: (error) => {
        if (axios.isAxiosError(error)) {
          const message = error.response?.data?.message;
          notification.error({
            message: "Error",
            description: message,
          });
          return;
        }

        notification.error({
          message: "Error",
          description: "Something went wrong",
        });
      },
    });

  return (
    <>
      <div>
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Profile
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Change your profile information.
              </p>
            </div>
          </div>
          <div className="mt-5 md:col-span-2 md:mt-0">
            <Form
              form={form}
              initialValues={{
                username: profile?.username,
              }}
              layout="vertical"
              onFinish={updateUsername}
            >
              <div className="shadow sm:overflow-hidden sm:rounded-md">
                <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                  <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: "Please input your username!",
                      },
                    ]}
                  >
                    <input
                      type="text"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </Form.Item>
                </div>
                <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                  <button
                    disabled={isLoading}
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    {isLoading ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>

      <div className="hidden sm:block" aria-hidden="true">
        <div className="py-5">
          <div className="border-t border-gray-200" />
        </div>
      </div>

      <div className="mt-10 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                Password
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Change your password information.
              </p>
            </div>
          </div>
          <div className="mt-5 md:col-span-2 md:mt-0">
            <Form layout="vertical" onFinish={updatePassowrd}>
              <div className="overflow-hidden shadow sm:rounded-md">
                <div className="bg-white px-4 py-5 sm:p-6">
                  <Form.Item
                    label="Current Password"
                    name="oldPassword"
                    rules={[
                      {
                        required: true,
                        message: "Please input your current password!",
                      },
                    ]}
                  >
                    <input
                      type="password"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </Form.Item>
                  <Form.Item
                    label="New Password"
                    name="newPassword"
                    rules={[
                      {
                        required: true,
                        message: "Please input your new password!",
                      },
                    ]}
                  >
                    <input
                      type="password"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </Form.Item>
                </div>
                <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                  <button
                    disabled={isPasswordLoading}
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    {isPasswordLoading ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
