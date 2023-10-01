import { Form, Switch, notification } from "antd";
import React from "react";
import api from "../../services/api";
import { useMutation, useQuery } from "@tanstack/react-query";

import { SettingsLayout } from "../../Layout/SettingsLayout";
import { SkeletonLoading } from "../../components/Common/SkeletonLoading";
import { useNavigate } from "react-router-dom";

export default function SettingsApplicationRoot() {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const { data, status } = useQuery(["fetchApplicationSettings"], async () => {
    const response = await api.get("/admin/dialoqbase-settings");
    return response.data as {
      noOfBotsPerUser: number;
      allowUserToCreateBots: boolean;
      allowUserToRegister: boolean;
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

  const { mutateAsync: updateApplicationSettings, isLoading } = useMutation(
    onUpdateApplicatoon,
    {
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
    }
  );

  return (
    <SettingsLayout>
      {status === "success" && (
        <>
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Application Settings
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-500">
              Configure your application settings
            </p>

            <dl className="mt-6 space-y-6 divide-y divide-gray-100  border-gray-200 text-sm leading-6 ">
              <div className="mt-5 md:col-span-2 md:mt-0">
                <Form
                  form={form}
                  initialValues={{
                    ...data,
                  }}
                  layout="vertical"
                  onFinish={updateApplicationSettings}
                >
                  <div className="sm:overflow-hidden ">
                    <div className="space-y-6 border-t border rounded-t-md  bg-white px-4 py-5 sm:p-6">
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
                         <input
                          type="number"
                          className="mt-1 block w-full border-gray-300 rounded-md  focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
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
        </>
      )}
      {status === "loading" && <SkeletonLoading />}

      {status === "error" && (
        <div className="text-center">Something went wrong</div>
      )}
    </SettingsLayout>
  );
}
