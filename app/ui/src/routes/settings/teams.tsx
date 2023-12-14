import { Form, Input, Modal, Table, Tag, Tooltip, notification } from "antd";
import React from "react";
import api from "../../services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { SettingsLayout } from "../../Layout/SettingsLayout";
import { SkeletonLoading } from "../../components/Common/SkeletonLoading";
import { useNavigate } from "react-router-dom";
import { KeyIcon } from "@heroicons/react/24/outline";
import axios from "axios";

export default function SettingsTeamsRoot() {
  const [newUser] = Form.useForm();
  const [resetPassword] = Form.useForm();
  const navigate = useNavigate();

  const [resetPasswordModal, setResetPasswordModal] = React.useState(false);
  const [resetPasswordUserId, setResetPasswordUserId] = React.useState(0);

  const [newUserModal, setNewUserModal] = React.useState(false);

  const queryClient = useQueryClient();

  const { data, status } = useQuery(["fetchAllUsers"], async () => {
    const response = await api.get("/admin/users");
    return response.data as {
      user_id: number;
      username: string;
      email: string;
      bots: number;
      is_admin: boolean;
    }[];
  });

  React.useEffect(() => {
    if (status === "error") {
      navigate("/settings");
    }
  }, [status]);

  const onResetPassword = async (values: any) => {
    const response = await api.post("/admin/reset-user-password", {
      ...values,
      user_id: resetPasswordUserId,
    });
    return response.data;
  };

  const {
    mutateAsync: resetPasswordMutation,
    isLoading: resetPasswordLoading,
  } = useMutation(onResetPassword, {
    onSuccess: (data) => {
      setResetPasswordModal(false);
      resetPassword.resetFields();
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
  });

  const onCreateUser = async (values: any) => {
    const response = await api.post("/admin/register-user", values);
    return response.data;
  };

  const { mutateAsync: createUser, isLoading: createUserLoading } = useMutation(
    onCreateUser,
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(["fetchAllUsers"]);
        setNewUserModal(false);
        newUser.resetFields();
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

  return (
    <SettingsLayout>
      {status === "success" && (
        <>
          <div>
            <div className="flex justify-between">
              <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                All Users
              </h2>
              <button
                type="button"
                onClick={() => setNewUserModal(true)}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add New User
              </button>
            </div>
            <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-200">
              Manage all users in your Dialoqbase Application
            </p>

            <dl className="mt-6 space-y-6 divide-y divide-gray-100   text-sm leading-6 ">
              <div className="mt-5 md:col-span-2 md:mt-0">
                <Table
                  columns={[
                    {
                      title: "Username",
                      dataIndex: "username",
                      key: "username",
                    },
                    {
                      title: "Email",
                      dataIndex: "email",
                    },
                    {
                      title: "Total Bots",
                      dataIndex: "bots",
                    },
                    {
                      title: "Role",
                      dataIndex: "is_admin",
                      render: (value) => (
                        <Tag color={value ? "green" : "blue"}>
                          {value ? "Admin" : "User"}
                        </Tag>
                      ),
                    },
                    {
                      title: "Actions",
                      render: (_, user) => (
                        <Tooltip title="Reset Password">
                          <button
                            type="button"
                            onClick={() => {
                              setResetPasswordUserId(user.user_id);
                              setResetPasswordModal(true);
                            }}
                            className="text-red-400 hover:text-red-500"
                          >
                            <KeyIcon className="h-5 w-5" />
                          </button>
                        </Tooltip>
                      ),
                    },
                  ]}
                  dataSource={data}
                />
              </div>
            </dl>
          </div>

          <Modal
            title="Reset Password"
            open={resetPasswordModal}
            onCancel={() => setResetPasswordModal(false)}
            footer={null}
          >
            <Form
              form={resetPassword}
              layout="vertical"
              onFinish={(values) => resetPasswordMutation(values)}
            >
              <Form.Item
                label="New Password"
                name="new_password"
                rules={[
                  {
                    required: true,
                    message: "Please input your new password!",
                  },
                ]}
              >
                <Input.Password size="large" type="password" />
              </Form.Item>

              <div className="flex justify-end">
                <button
                  disabled={resetPasswordLoading}
                  type="submit"
                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white  hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  {resetPasswordLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </Form>
          </Modal>

          <Modal
            title="Add New User"
            open={newUserModal}
            onCancel={() => setNewUserModal(false)}
            footer={null}
          >
            <Form
              form={newUser}
              layout="vertical"
              onFinish={(values) => createUser(values)}
            >
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
                <Input
                size="large"
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
                <Input
                size="large"  
                  type="email"
                />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!",
                  },
                ]}
              >
                <Input.Password
                size="large"
                />
              </Form.Item>

              <div className="flex justify-end">
                <button
                  disabled={createUserLoading}
                  type="submit"
                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white  hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  {createUserLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </Form>
          </Modal>
        </>
      )}
      {status === "loading" && <SkeletonLoading />}

      {status === "error" && (
        <div className="text-center">Something went wrong</div>
      )}
    </SettingsLayout>
  );
}
