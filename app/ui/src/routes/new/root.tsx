import { useState } from "react";
import { RadioGroup } from "@headlessui/react";
import {
  GlobeAltIcon,
  DocumentArrowUpIcon,
  DocumentTextIcon,
} from "@heroicons/react/20/solid";
import { Form, Upload, UploadProps, message, notification } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useMutation } from "@tanstack/react-query";
import { InboxIcon } from "@heroicons/react/24/outline";

const availableSources = [
  { id: 1, title: "Website", icon: GlobeAltIcon },
  { id: 2, title: "PDF", icon: DocumentArrowUpIcon },
  { id: 3, title: "Text", icon: DocumentTextIcon },
];
// @ts-ignore
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function NewRoot() {
  const [selectedSource, setSelectedSource] = useState(availableSources[0]);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const onSubmit = async (values: any) => {
    if (selectedSource.id == 2) {
      // /bot/pdf multipart/form-data
      const formData = new FormData();
      formData.append("file", values.file[0].originFileObj);
      const response = await api.post("/bot/pdf", formData, {
        headers: {  
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    }
    const response = await api.post("/bot", {
      type: selectedSource.title.toLowerCase(),
      ...values,
    });
    return response.data;
  };
  const { mutateAsync: createBot, isLoading } = useMutation(onSubmit, {
    onSuccess: (data: any) => {
      notification.success({
        message: "Success",
        description: "Bot created successfully.",
      });
      navigate(`/bot/${data.id}`);
    },
    onError: (e) => {
      console.log(e);
      notification.error({
        message: "Error",
        description: "Something went wrong.",
      });
    },
  });

  const props: UploadProps = {
    accept: ".pdf",
    beforeUpload: (file) => {
      const isPDF = file.type === "application/pdf";
      if (!isPDF) {
        message.error("You can only upload PDF file!");
      }
      return isPDF || Upload.LIST_IGNORE;
    },
  };

  return (
    <>
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Create a new bot
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <Form onFinish={createBot} form={form} className="space-y-6">
              <RadioGroup value={selectedSource} onChange={setSelectedSource}>
                <RadioGroup.Label className="text-base font-medium text-gray-800">
                  Select a data source
                </RadioGroup.Label>

                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-3 sm:gap-x-4">
                  {availableSources.map((source) => (
                    <RadioGroup.Option
                      key={source.id}
                      value={source}
                      className={({ checked, active }) =>
                        classNames(
                          checked ? "border-transparent" : "border-gray-300",
                          active
                            ? "border-indigo-500 ring-2 ring-indigo-500"
                            : "",
                          "relative  items-center justify-center flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none"
                        )
                      }
                    >
                      {({ checked, active }) => (
                        <>
                          <span className="flex-shrink-0 flex items-center justify-centerrounded-lg">
                            <RadioGroup.Label
                              as="span"
                              className="block text-sm font-medium text-gray-900"
                            >
                              <source.icon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </RadioGroup.Label>
                            {source.title}
                          </span>

                          <span
                            className={classNames(
                              active ? "border" : "border-2",
                              checked
                                ? "border-indigo-500"
                                : "border-transparent",
                              "pointer-events-none absolute -inset-px rounded-lg"
                            )}
                            aria-hidden="true"
                          />
                        </>
                      )}
                    </RadioGroup.Option>
                  ))}
                </div>
              </RadioGroup>

              <Form.Item
                name="content"
                hidden={selectedSource.id == 2}
                rules={[
                  {
                    required: selectedSource.id != 2,
                    message: "Please input your content!",
                  },
                ]}
              >
                {selectedSource.id == 1 ? (
                  <input
                    type="url"
                    placeholder="Enter the website URL"
                    className=" block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                  />
                ) : null}

                {selectedSource.id == 3 ? (
                  <textarea
                    placeholder="Enter the text"
                    className=" block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
                  />
                ) : null}
              </Form.Item>

              {selectedSource.id == 2 && (
                <Form.Item
                  name="file"
                  rules={[
                    {
                      required: true,
                      message: "Please upload your PDF!",
                    },
                  ]}
                  getValueFromEvent={(e) => {
                    console.log("Upload event:", e);
                    if (Array.isArray(e)) {
                      return e;
                    }
                    return e?.fileList;
                  }}
                >
                  <Upload.Dragger {...props}>
                    <div className="p-3">
                      <p className="ant-upload-drag-icon justify-center flex">
                        <InboxIcon className="h-10 w-10 text-gray-400" />
                      </p>
                      <p className="ant-upload-text">
                        Click or drag PDF to this area to upload
                      </p>
                      <p className="ant-upload-hint">
                        Ensure selectable and copyable PDF text for processing.
                      </p>
                    </div>
                  </Upload.Dragger>
                </Form.Item>
              )}

              <Form.Item>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  {isLoading ? "Creating..." : "Create"}
                </button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
