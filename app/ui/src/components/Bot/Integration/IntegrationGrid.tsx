import { Modal } from "antd";
import React from "react";
import { IntegrationForm } from "./IntegrationForm";
import { useParams } from "react-router-dom";
import { IntegrationCard } from "./IntegrationCard";

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
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            Integrations
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">
            Make your bot aviailable on different channels and platforms.
          </p>
        </div>
      </div>
      {/* GRID */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((integration) => (
          <IntegrationCard
            onClick={() => {
              setSelectedIntegration(integration);
              setOpen(true);
            }}
            logo={integration.logo}
            name={integration.name}
            color={integration.color}
            textColor={integration.textColor}
            status={integration.status}
            description={integration.description}
          />
        ))}

        <IntegrationCard
          href={`/bot/${param.id}/embed`}
          logo="/providers/html.svg"
          name="HTML Embed"
          color="#fff"
          textColor="#000"
          description="Embed your chatbot on your website or blog using HTML snippet."
        />

        <IntegrationCard
          href={`/bot/${param.id}/integrations/api`}
          logo="/providers/api.svg"
          name="API"
          color="#fff"
          textColor="#000"
          description="Customize your integration using our robust API. Connect and expand the capabilities of your chatbot across platforms."
        />
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
