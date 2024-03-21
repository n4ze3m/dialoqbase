import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../../../services/api";
import { Form, Input, Modal, Table, Tooltip, notification } from "antd";
import { TrashIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import React from "react";
import { CopyBtn } from "../../../Common/CopyBtn";

export const UserApiKey = () => {
  const queryClient = useQueryClient();
  const [openModal, setOpenModal] = React.useState(false);
  const [apiKey, setApiKey] = React.useState("");
  const [openApiKey, setOpenApiKey] = React.useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["fetchUserApiKey"],
    queryFn: async () => {
      const res = await api.get("/user/api-key");
      const data = res.data["data"] as {
        id: number;
        api_key: string;
        name: string;
        createdAt: string;
      }[];
      return data;
    },
  });

  const onDeleteApiKey = async (id: number) => {
    await api.delete(`/user/api-key/${id}`);
  };

  const { mutate: deleteApiKey, isLoading: isDeleting } = useMutation(
    onDeleteApiKey,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["fetchUserApiKey"],
        });
        notification.success({
          message: "Success",
          description: "API Key deleted",
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

  const onCreateApiKey = async (values: any) => {
    const response = await api.post("/user/api-key", values);

    return response.data as {
      data: {
        api_key: string;
      };
    };
  };

  const { mutate: createApiKey, isLoading: isCreating } = useMutation(
    onCreateApiKey,
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: ["fetchUserApiKey"],
        });
        setApiKey(data.data.api_key);
        setOpenApiKey(true);
        setOpenModal(false);
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
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
          API Key
        </h2>

        <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-200">
          Manage your Dialoqbase API key
        </p>
      </div>

      <div className="flex justify-end">
        <button
        onClick={() => setOpenModal(true)}
        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Generate New API Key
        </button>
      </div>
      <div>
        <Table
          columns={[
            {
              title: "Name",
              dataIndex: "name",
              key: "name",
            },
            {
              title: "API Key",
              dataIndex: "api_key",
              key: "api_key",
            },
            {
              title: "Created At",
              dataIndex: "createdAt",
              key: "createdAt",
              render: (text) => new Date(text).toLocaleString(),
            },
            {
              title: "Action",
              key: "action",
              render: (_, record) => (
                <Tooltip title="Delete API Key">
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => {
                      const confirm = window.confirm(
                        "Are you sure you want to delete this API Key?"
                      );

                      if (confirm) {
                        deleteApiKey(record.id);
                      }
                    }}
                    className="text-red-400 hover:text-red-500"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </Tooltip>
              ),
            },
          ]}
          loading={isLoading}
          dataSource={data || []}
        />
      </div>

      <Modal
        title="Generate New API Key"
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          onFinish={(values) => {
            createApiKey(values);
          }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please input your name!",
              },
            ]}
          >
            <Input size="large" type="text" placeholder="Name" />
          </Form.Item>
          <div className="text-right">
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white  hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {isCreating ? "Generating..." : "Generate"}
            </button>
          </div>
        </Form>
      </Modal>

      <Modal
        title="API Key Generated Successfully"
        open={openApiKey}
        onCancel={() => setOpenApiKey(false)}
        footer={null}
      >
        <p className="text-xs text-gray-500 dark:text-gray-200">
          Your API Key has been generated successfully. Please copy the API Key
          and save it in a safe place. You will not be able to see this API Key
          again.
        </p>

        <div className="flex mt-5">
          <Input
            size="large"
            type="text"
            value={apiKey}
            readOnly
            className="w-full"
          />

          <CopyBtn value={apiKey} />
        </div>
      </Modal>
    </div>
  );
};
