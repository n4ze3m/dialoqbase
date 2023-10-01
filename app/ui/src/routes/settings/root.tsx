import { Form, notification } from "antd";
import React from "react";
import api from "../../services/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";

import { SettingsLayout } from "../../Layout/SettingsLayout";
import { SkeletonLoading } from "../../components/Common/SkeletonLoading";
import { useNavigate } from "react-router-dom";

export default function SettingsRoot() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { data, status } = useQuery(["fetchMe"], async () => {
    const response = await api.get("/user/me");
    return response.data as {
      username: string;
      email: string;
    };
  });

  React.useEffect(() => {
    if (status === "error") {
      navigate("/login");
    }
  }, [status]);

  const onUpdateProfile = async (values: any) => {
    const response = await api.post("/user/me", values);
    return response.data;
  };

  const { mutateAsync: updateProfile, isLoading } = useMutation(
    onUpdateProfile,
    {
      onSuccess: (data) => {
        notification.success({
          message: "Success",
          description: data.message,
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
    <SettingsLayout>
      {status === "success" && (
        <>
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Profile
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-500">
              Update your profile details.
            </p>

            <dl className="mt-6 space-y-6 divide-y divide-gray-100  border-gray-200 text-sm leading-6 ">
              <div className="mt-5 md:col-span-2 md:mt-0">
                <Form
                  form={form}
                  initialValues={{
                    ...data,
                  }}
                  layout="vertical"
                  onFinish={updateProfile}
                >
                  <div className="sm:overflow-hidden ">
                    <div className="space-y-6 border-t border rounded-t-md  bg-white px-4 py-5 sm:p-6">
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
                          className="mt-1 block w-full border-gray-300 rounded-md  focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </Form.Item>
                      <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                          {
                            required: true,
                            message: "Please input your email!",
                          },
                        ]}
                      >
                        <input
                          type="email"
                          className="mt-1 block w-full border-gray-300 rounded-md  focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </Form.Item>
                    </div>
                    <div className="bg-gray-50 border-x border-b rounded-b-md rounded-x-md px-4 py-3 text-right sm:px-6">
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
              </div>
            </dl>
          </div>

          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Password
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-500">
              Update your password.
            </p>

            <dl className="mt-6 space-y-6 divide-y divide-gray-100  border-gray-200 text-sm leading-6 ">
              <div className="mt-5 md:col-span-2 md:mt-0">
                <Form layout="vertical" onFinish={updatePassowrd}>
                  <div className="overflow-hidden sm:rounded-md">
                    <div className="bg-white border-t border rounded-t-md  px-4 py-5 sm:p-6">
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
                          className="mt-1 block w-full border-gray-300 rounded-md  focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                          className="mt-1 block w-full border-gray-300 rounded-md  focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </Form.Item>
                    </div>
                    <div className="bg-gray-50 border-x border-b rounded-b-md rounded-x-md  px-4 py-3 text-right sm:px-6">
                      <button
                        disabled={isPasswordLoading}
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white  hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        {isPasswordLoading ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                </Form>
              </div>
            </dl>
          </div>
        </>
      )}
      {status === "loading" && <SkeletonLoading />}

      {status === "error" && (
        <div className="text-center">Something went wrong</div>
      )}
    </SettingsLayout>
  );
}
