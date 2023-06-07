import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import { useMutation } from "@tanstack/react-query";
import { BotForm } from "../../components/Common/BotForm";
import { Form, notification } from "antd";
import axios from "axios";

export default function NewRoot() {
  const navigate = useNavigate();
  const [selectedSource, setSelectedSource] = useState<any>(null);
  const [form] = Form.useForm();
  const onSubmit = async (values: any) => {
    if (selectedSource.id == 2) {
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
      if(axios.isAxiosError(e)) {
        const message = e.response?.data?.message || e?.response?.data?.error || "Something went wrong.";
        notification.error({
          message: "Error",
          description: message,
        });
        return;
      }

      notification.error({
        message: "Error",
        description: "Something went wrong.",
      });
    },
  });

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
            <BotForm
              createBot={createBot}
              isLoading={isLoading}
              setSelectedSource={setSelectedSource}
              form={form}
            />
          </div>
        </div>
      </div>
    </>
  );
}
