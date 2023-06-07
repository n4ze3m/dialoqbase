import { useState } from "react";
import {
  GlobeAltIcon,
  // DocumentArrowUpIcon,
  DocumentTextIcon,
} from "@heroicons/react/20/solid";
import { Form, notification } from "antd";
import { useParams } from "react-router-dom";
import api from "../../../services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BotForm } from "../../Common/BotForm";

const availableSources = [
  { id: 1, title: "Website", icon: GlobeAltIcon },
  // { id: 2, title: "PDF", icon: DocumentArrowUpIcon },
  { id: 3, title: "Text", icon: DocumentTextIcon },
];
// @ts-ignore
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const NewDsForm = ({ onClose }: { onClose: () => void }) => {
  const [selectedSource, setSelectedSource] = useState<any>(null);
  const params = useParams<{ id: string }>();
  const client = useQueryClient();
  const [form] = Form.useForm();
  const onSubmit = async (values: { content: string }) => {
    const response = await api.post(`/bot/${params.id}/source`, {
      type: selectedSource.title.toLowerCase(),
      ...values,
    });
    return response.data;
  };

  const { mutateAsync: createBot, isLoading } = useMutation(onSubmit, {
    onSuccess: () => {
      client.invalidateQueries(["getBotDS", params.id]);
      onClose();
      notification.success({
        message: "Success",
        description: "New Source added successfully.",
      });
      form.resetFields();
      setSelectedSource(availableSources[0]);
    },
    onError: (e) => {
      console.log(e);
      notification.error({
        message: "Error",
        description: "Something went wrong.",
      });
    },
  });

  return (
    <>
      <BotForm
        form={form}
        createBot={createBot}
        isLoading={isLoading}
        setSelectedSource={setSelectedSource}
      />
    </>
  );
};
