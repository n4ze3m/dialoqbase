import { Divider, Form, FormInstance, Input, notification } from "antd";
import { AppearanceType } from "./types";
import { DbColorPicker } from "../../Common/DbColorPicker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import api from "../../../services/api";
import axios from "axios";
type Props = AppearanceType;

export const AppearanceForm = ({
  initialData,
  form,
}: {
  initialData: Props;
  form: FormInstance;
}) => {
  const botBubbleStyle = Form.useWatch("chat_bot_bubble_style", form);
  const humanBubbleStyle = Form.useWatch("chat_human_bubble_style", form);

  const params = useParams<{ id: string }>();

  const onFinish = async (values: any) => {
    let data = {
      ...values,
      chat_bot_bubble_style: {
        ...values.chat_bot_bubble_style,
        background_color:
          typeof values.chat_bot_bubble_style.background_color === "string"
            ? values.chat_bot_bubble_style.background_color
            : `#${values.chat_bot_bubble_style.background_color.toHex()}`,
        text_color:
          typeof values.chat_bot_bubble_style.text_color === "string"
            ? values.chat_bot_bubble_style.text_color
            : `#${values.chat_bot_bubble_style.text_color.toHex()}`,
      },
      chat_human_bubble_style: {
        ...values.chat_human_bubble_style,
        background_color:
          typeof values.chat_human_bubble_style.background_color === "string"
            ? values.chat_human_bubble_style.background_color
            : `#${values.chat_human_bubble_style.background_color.toHex()}`,
        text_color:
          typeof values.chat_human_bubble_style.text_color === "string"
            ? values.chat_human_bubble_style.text_color
            : `#${values.chat_human_bubble_style.text_color.toHex()}`,
      },
    };

    const response = await api.post(`/bot/appearance/${params.id}`, data);
    return response.data;
  };

  const client = useQueryClient();

  const { mutate: updateAppearance, isLoading: isUpdatingAppearance } =
    useMutation(onFinish, {
      onSuccess: () => {
        client.invalidateQueries(["getBotAppearance", params.id]);
        notification.success({
          message: "Success",
          description: "Bot appearance updated successfully",
        });
      },
      onError: (e: any) => {
        if (axios.isAxiosError(e)) {
          const message = e.response?.data?.message || "Something went wrong";
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
    <Form
      requiredMark={false}
      initialValues={{
        ...initialData.data,
      }}
      layout="vertical"
      form={form}
      onFinish={updateAppearance}
    >
      <Form.Item
        rules={[
          {
            required: true,
            message: "Please input your Bot Name!",
          },
        ]}
        label="Bot Name"
        name="bot_name"
      >
        <Input size="large" type="text" />
      </Form.Item>

      <Form.Item
        rules={[
          {
            required: true,
            message: "Please input your Greeting Message!",
          },
        ]}
        label="Greeting Message"
        name="first_message"
      >
        <Input size="large" />
      </Form.Item>

      <Divider orientation="left">Style</Divider>

      {/* <Form.Item
        rules={[
          {
            required: true,
            message: "Please pick a color!",
          },
        ]}
        name="background_color"
        label="Background Color"
      >
        <DbColorPicker
          pickedColor={
            typeof colorHex === "string" ? colorHex : `#${colorHex?.toHex()}`
          }
        />
      </Form.Item> */}

      <Form.Item label="Bot bubble style" name="chat_bot_bubble_style">
        <div className="flex flex-row justify-normal space-x-6">
          <Form.Item
            name={["chat_bot_bubble_style", "background_color"]}
            label={<span className="text-xs">bg color</span>}
            rules={[
              {
                required: true,
                message: "Please pick a color!",
              },
            ]}
          >
            <DbColorPicker
              format="hex"
              pickedColor={
                typeof botBubbleStyle?.background_color === "string"
                  ? botBubbleStyle?.background_color
                  : `#${botBubbleStyle?.background_color?.toHex()}`
              }
            />
          </Form.Item>

          <Form.Item
            name={["chat_bot_bubble_style", "text_color"]}
            label={<span className="text-xs">text color</span>}
            rules={[
              {
                required: true,
                message: "Please pick a color!",
              },
            ]}
          >
            <DbColorPicker
              pickedColor={
                typeof botBubbleStyle?.text_color === "string"
                  ? botBubbleStyle?.text_color
                  : `#${botBubbleStyle?.text_color?.toHex()}`
              }
            />
          </Form.Item>
        </div>
      </Form.Item>

      <Form.Item label="Human bubble style" name="chat_human_bubble_style">
        <div className="flex flex-row justify-normal space-x-6">
          <Form.Item
            name={["chat_human_bubble_style", "background_color"]}
            label={<span className="text-xs">bg color</span>}
            rules={[
              {
                required: true,
                message: "Please pick a color!",
              },
            ]}
          >
            <DbColorPicker
              pickedColor={
                typeof humanBubbleStyle?.background_color === "string"
                  ? humanBubbleStyle?.background_color
                  : `#${humanBubbleStyle?.background_color?.toHex()}`
              }
            />
          </Form.Item>

          <Form.Item
            name={["chat_human_bubble_style", "text_color"]}
            label={<span className="text-xs">text color</span>}
            rules={[
              {
                required: true,
                message: "Please pick a color!",
              },
            ]}
          >
            <DbColorPicker
              pickedColor={
                typeof humanBubbleStyle?.text_color === "string"
                  ? humanBubbleStyle?.text_color
                  : `#${humanBubbleStyle?.text_color?.toHex()}`
              }
            />
          </Form.Item>
        </div>
      </Form.Item>

      <div className="mt-3 text-right">
        <button
          type="submit"
          disabled={isUpdatingAppearance}
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
        >
          {isUpdatingAppearance ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </Form>
  );
};
