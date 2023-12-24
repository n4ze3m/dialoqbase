import { Form, Input, Radio } from "antd";
import { CopyBtn } from "../../Common/CopyBtn";
import { DbColorPicker } from "../../Common/DbColorPicker";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/cjs/styles/prism";

export function EmbedBoardScript({
  hostUrl,
  public_id,
}: {
  public_id: string;
  hostUrl: string;
}) {
  const [from] = Form.useForm();

  const widgetBtnColor = Form.useWatch("data-widget-btn-color", from);
  const widgetPosition = Form.useWatch("data-btn-position", from);
  const widgetIcon = Form.useWatch("data-widget-icon", from);
  //content={`<script src="${hostUrl}/chat.min.js" data-chat-url="${hostUrl}/bot/${public_id}" data-btn-position="bottom-right" defer></script>`}
  return (
    <div className="px-4 py-6 sm:p-6 lg:pb-8 mb-3 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-[#0a0a0a] dark:border-[#232222]">
      <h2 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
        Script
      </h2>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        You can use this script to embed your bot to your website or web app
      </p>
      <div className="mt-6 flex flex-col ">
        <Form
          form={from}
          initialValues={{
            "data-btn-position": "bottom-right",
            "data-widget-btn-color": "#9b59b6",
          }}
          layout="vertical"
        >
          <Form.Item
            name="data-btn-position"
            label="Widget Position"
            tooltip="This position will be used for the widget button position"
          >
            <Radio.Group size="large">
              <Radio.Button value="bottom-right">Bottom Right</Radio.Button>
              <Radio.Button value="bottom-left">Bottom Left</Radio.Button>
              <Radio.Button value="top-right">Top Right</Radio.Button>
              <Radio.Button value="top-left">Top Left</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="data-widget-icon"
            label="Widget Icon"
            tooltip="This icon will be used for the widget button icon default is the bot icon"
          >
            <Input size="large" placeholder="https://example.com/icon.png" />
          </Form.Item>

          <Form.Item
            name="data-widget-btn-color"
            label="Widget Button Color"
            tooltip="This color will be used for the widget button background color"
          >
            <DbColorPicker
              format="hex"
              pickedColor={
                typeof widgetBtnColor === "string"
                  ? widgetBtnColor
                  : `#${widgetBtnColor?.toHex()}`
              }
            />
          </Form.Item>
        </Form>

        <div>
          <div className="flex-grow">
            <SyntaxHighlighter
              language="html"
              customStyle={{
                borderRadius: "0.7rem",
                lineHeight: "1.25rem",
                overflow: "auto",
                fontFamily: "Menlo, Monaco, Consolas, 'Courier New', monospace",
                color: "#d6deeb",
              }}
              style={nightOwl}
              codeTagProps={{
                className: "text-sm",
              }}
            >
              {`<script 
    src="${hostUrl}/chat.min.js" 
    data-chat-url="${hostUrl}/bot/${public_id}" 
    data-btn-position="${widgetPosition}"
    data-widget-btn-color="${
      typeof widgetBtnColor === "string"
        ? widgetBtnColor
        : `#${widgetBtnColor?.toHex()}`
    }"${widgetIcon ? `\n    data-widget-icon="${widgetIcon}"` : ""}
    defer>
</script>`}
            </SyntaxHighlighter>
            {/* <Input
              size="large"
              type="text"
              readOnly
              defaultValue={`<script src="${import.meta.env.VITE_HOST_URL}/chat.min.js" data-chat-url="${import.meta.env.VITE_HOST_URL}/bot/${import.meta.env.VITE_PUBLIC_ID}" data-btn-position="bottom-right" defer></script>`}
            /> */}
          </div>
          <span className="flex justify-end mt-4">
            <CopyBtn
              value={`<script src="${hostUrl}/chat.min.js" data-chat-url="${hostUrl}/bot/${public_id}" data-btn-position="${widgetPosition}" data-widget-btn-color="${
                typeof widgetBtnColor === "string"
                  ? widgetBtnColor
                  : `#${widgetBtnColor?.toHex()}`
              } "${
                widgetIcon ? `data-widget-icon="${widgetIcon}"` : ""
              } defer> </script>`}
              className="border border-gray-300 dark:border-[#232222] dark:text-white dark:hover:bg-[#333030] dark:focus:ring-gray-900 rounded-md dark:bg-[#232222]"
            />
          </span>
        </div>
      </div>
      {/* <div>
      <div className="mt-6 flex flex-col lg:flex-row">
        <div className="flex-grow space-y-6">
          <div className="flex">
            <div className="flex-grow">
              <Input size="large" type="text" readOnly defaultValue={content} />
            </div>
            <span className="ml-3">
              <CopyBtn
                value={content}
                className="border border-gray-300 dark:border-[#232222] dark:text-white dark:hover:bg-[#232222] dark:focus:ring-gray-900 rounded-md"
              />
            </span>
          </div>
        </div>
      </div> */}
    </div>
  );
}
