import { ClipboardIcon } from "@heroicons/react/24/outline";
import { notification } from "antd";
import React from "react";

type Props = {
  public_id: string;
};

export const EmbedBoard = ({ public_id }: Props) => {
  const [hostUrl] = React.useState<string>(
    () =>
      import.meta.env.VITE_HOST_URL ||
      window.location.protocol + "//" + window.location.host
  );

  return (
    <div className="divide-y lg:col-span-9">
      <EmbedBoardTitle
        title="Public URL"
        description="This is the public URL of your bot. You can use this URL to embed"
        content={`${hostUrl}/bot/${public_id}`}
      />

      <EmbedBoardTitle
        title="Iframe"
        description="You can use this iframe to embed your bot"
        content={`<iframe src="${hostUrl}/bot/${public_id}?mode=iframe" width="400" height="500" />`}
      />

      <EmbedBoardTitle
        title="Script"
        description="You can use this script to embed your bot to your website or web app"
        content={`<script src="${hostUrl}/chat.min.js" data-chat-url="${hostUrl}/bot/${public_id}" data-btn-position="bottom-right" defer></script>`}
      />
    </div>
  );
};
function EmbedBoardTitle({
  content,
  title,
  description,
}: {
  content: string;
  title: string;
  description: string;
}) {
  return (
    <div className="px-4 py-6 sm:p-6 lg:pb-8 mb-3 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div>
        <h2 className="text-lg font-medium leading-6 text-gray-900">{title}</h2>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
      <div className="mt-6 flex flex-col lg:flex-row">
        <div className="flex-grow space-y-6">
          <div className="flex">
            <div className="flex-grow">
              <input
                type="text"
                readOnly
                defaultValue={content}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
              />
            </div>
            <span className="ml-3">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(content);
                  notification.success({
                    message: "Copied!",
                    placement: "bottomRight",
                  });
                }}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              >
                <ClipboardIcon
                  className="h-5 w-5 text-gray-500"
                  aria-hidden="true"
                />
                <span className="ml-2">Copy</span>
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
