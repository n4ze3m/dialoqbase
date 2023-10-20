import { Modal } from "antd";
import React from "react";
import { IntegrationForm } from "./IntegrationForm";
import { Link, useParams } from "react-router-dom";

type Props = {
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
      help: string;
      inputType: string;
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
  }[];
};

export const IntegrationGrid: React.FC<Props> = ({ data }) => {
  const [open, setOpen] = React.useState(false);
  const [selectedIntegration, setSelectedIntegration] = React.useState<{
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
      help: string;
      requiredMessage: string;
      inputType: string;
      value: string;
    }[];
    isPaused: boolean;
    status: string;
    color: string;
    textColor: string;
  } | null>();
  const param = useParams<{ id: string }>();

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Integrations</h1>
          <p className="mt-2 text-sm text-gray-700">
            Make your bot aviailable on different channels and platforms.
          </p>
        </div>
      </div>
      {/* GRID */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((integration) => (
          <div className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg overflow-hidden border hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer">
            <div
              onClick={() => {
                setSelectedIntegration(integration);
                setOpen(true);
              }}
            >
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <img
                    className="h-12 w-auto"
                    src={integration.logo}
                    alt={integration.name}
                  />
                  <div className="ml-2 flex flex-shrink-0">
                    <p
                      className={`inline-flex rounded-md px-2 text-sm  leading-5 border border-transparent uppercase tracking-widest  `}
                      style={{
                        backgroundColor: integration.color,
                        color: integration.textColor,
                        borderColor:
                          integration.color !== "#fff"
                            ? integration.color
                            : "#000",
                      }}
                    >
                      {integration.status}
                    </p>
                  </div>
                </div>
              </div>
              <div className="sm:flex sm:items-center">
                <div className="text-center sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {integration.name}
                  </h3>
                  <p className="mt-2 text-xs text-gray-500">
                    {integration.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        <Link
          to={`/bot/${param.id}/embed`}
          className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg overflow-hidden border hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer"
        >
          <div>
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <img
                  className="h-12 w-auto"
                  src="/providers/html.svg"
                  alt="HTML"
                />
              </div>
            </div>
            <div className="sm:flex sm:items-center">
              <div className="text-center sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  HTML Embed
                </h3>
                <p className="mt-2 text-xs text-gray-500">
                  Embed your chatbot on your website or blog using HTML snippet.
                </p>
              </div>
            </div>
          </div>
        </Link>

        <Link
          to={`/bot/${param.id}/integrations/api`}
          className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg overflow-hidden border hover:shadow-lg transition-shadow duration-300 ease-in-out cursor-pointer"
        >
          <div>
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <img
                  className="h-12 w-auto"
                  src="/providers/api.svg"
                  alt="API"
                />
              </div>
            </div>
            <div className="sm:flex sm:items-center">
              <div className="text-center sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  API
                </h3>
                <p className="mt-2 text-xs text-gray-500">
                  Customize your integration using our robust API. Connect and
                  expand the capabilities of your chatbot across platforms.
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* MODAL */}
      <Modal
        title={`${selectedIntegration?.name} Integration`}
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        maskClosable={false}
      >
        <IntegrationForm
          onClose={() => setOpen(false)}
          data={selectedIntegration!}
        />
      </Modal>
    </div>
  );
};
