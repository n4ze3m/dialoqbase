import {
  Divider,
  Form,
  FormInstance,
  Select,
  Upload,
  UploadProps,
  message,
} from "antd";
import { RadioGroup } from "@headlessui/react";
import {
  DocumentArrowUpIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  InboxIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import { availableEmbeddingTypes } from "../../utils/embeddings";
import { availableChatModels } from "../../utils/chatModels";
import { SpiderIcon } from "./SpiderIcon";

type Props = {
  createBot: (values: any) => void;
  isLoading: boolean;
  setSelectedSource: React.Dispatch<React.SetStateAction<any>>;
  form: FormInstance<any>;
  showEmbeddingAndModels: boolean;
};
// @ts-ignore
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const availableSources = [
  { id: 1, value: "website", title: "Webpage", icon: GlobeAltIcon },
  { id: 3, value: "text", title: "Text", icon: DocumentTextIcon },
  { id: 2, value: "pdf", title: "PDF (beta)", icon: DocumentArrowUpIcon },
  {
    id: 4,
    value: "crawl",
    title: "Crawler (beta)",
    icon: SpiderIcon,
  },
];
export const BotForm = ({
  createBot,
  isLoading,
  setSelectedSource,
  form,
  showEmbeddingAndModels,
}: Props) => {
  const [selectedSource, _setSelectedSource] = React.useState<any>(
    availableSources[0]
  );

  const props: UploadProps = {
    accept: ".pdf",
    multiple: false,
    maxCount: 1,
    beforeUpload: (file) => {
      const isPDF = file.type === "application/pdf";
      if (!isPDF) {
        message.error("You can only upload PDF file!");
      }
      return false;
    },
  };

  const embeddingType = Form.useWatch("embedding", form);

  return (
    <Form
      layout="vertical"
      onFinish={createBot}
      form={form}
      className="space-y-6"
      initialValues={{
        embedding: "openai",
        model: "gpt-3.5-turbo",
        maxDepth: 2,
        maxLinks: 10,
      }}
    >
      <RadioGroup
        value={selectedSource}
        onChange={(e: any) => {
          _setSelectedSource(e);
          setSelectedSource(e);
        }}
      >
        <RadioGroup.Label className="text-base font-medium text-gray-800">
          Select a data source
        </RadioGroup.Label>

        <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
          {availableSources.map((source) => (
            <RadioGroup.Option
              key={source.id}
              value={source}
              className={({ checked, active }) =>
                classNames(
                  checked ? "border-transparent" : "border-gray-300",
                  active ? "border-indigo-500 ring-2 ring-indigo-500" : "",
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
                        className="h-6 w-6 mr-3"
                        aria-hidden="true"
                      />
                    </RadioGroup.Label>
                    {source.title}
                  </span>

                  <span
                    className={classNames(
                      active ? "border" : "border-2",
                      checked ? "border-indigo-500" : "border-transparent",
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
        hidden={selectedSource.id === 2}
        rules={[
          {
            required: selectedSource.id !== 2,
            message: "Please input your content!",
          },
        ]}
      >
        {selectedSource.id === 1 ? (
          <input
            type="url"
            placeholder="Enter the website URL"
            className=" block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
          />
        ) : null}

        {selectedSource.id === 3 ? (
          <textarea
            placeholder="Enter the text"
            className=" block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
          />
        ) : null}

        {selectedSource.id === 4 ? (
          <input
            type="url"
            placeholder="Enter the website URL"
            className=" block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
          />
        ) : null}
      </Form.Item>

      {selectedSource.id === 2 && (
        <>
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
          <p className="text-sm text-gray-500">
            If you find any issues, please report them on{" "}
            <a
              href="https://github.com/n4ze3m/dialoqbase/issues/new?title=PDF%20upload%20issue&type=bug&labels=bug"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              GitHub
            </a>
            .
          </p>
        </>
      )}

      {selectedSource.id === 4 && (
        <>
          <Form.Item
            name="maxDepth"
            help="The max depth of the website to crawl"
            rules={[
              {
                required: true,
                message: "Please input max depth!",
              },
            ]}
          >
            <input
              type="number"
              placeholder="Enter the max depth"
              className=" block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
            />
          </Form.Item>

          <Form.Item
            name="maxLinks"
            help="The max links to crawl"
            rules={[
              {
                required: true,
                message: "Please input max links count",
              },
            ]}
          >
            <input
              type="number"
              placeholder="Enter the max depth"
              className=" block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
            />
          </Form.Item>

          <p className="text-sm text-gray-500">
            If you find any issues, please report them on{" "}
            <a
              href="https://github.com/n4ze3m/dialoqbase/issues/new?title=Crawler%20issue&labels=bug"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              GitHub
            </a>
            .
          </p>
        </>
      )}

      <Form.Item hidden={!showEmbeddingAndModels} noStyle>
        <Divider />
      </Form.Item>

      <Form.Item
        hidden={!showEmbeddingAndModels}
        label={
          <span className="font-medium text-gray-800 text-sm">Chat Model</span>
        }
        name="model"
      >
        <Select
          placeholder="Select a chat model"
          options={availableChatModels}
        />
      </Form.Item>

      <Form.Item
        hidden={!showEmbeddingAndModels}
        label={
          <span className="font-medium text-gray-800 text-sm">
            Embedding method
          </span>
        }
        name="embedding"
        hasFeedback={embeddingType === "tensorflow"}
        help={
          embeddingType === "tensorflow"
            ? "TensorFlow embeddings can be slow and memory-intensive."
            : null
        }
        validateStatus={embeddingType === "tensorflow" ? "warning" : undefined}
      >
        <Select
          placeholder="Select an embedding method"
          options={availableEmbeddingTypes}
        />
      </Form.Item>

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
  );
};
