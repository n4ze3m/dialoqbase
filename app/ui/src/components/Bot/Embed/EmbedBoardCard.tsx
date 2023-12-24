import { Input } from "antd";
import { CopyBtn } from "../../Common/CopyBtn";

export function EmbedBoardCard({
  content,
  title,
  description,
}: {
  content: string;
  title: string;
  description: string;
}) {
  return (
    <div className="px-4 py-6 sm:p-6 lg:pb-8 mb-3 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-[#0a0a0a] dark:border-[#232222]">
      <div>
        <h2 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
          {title}
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
      <div className="mt-6 flex flex-col lg:flex-row">
        <div className="flex-grow space-y-6">
          <div className="flex">
            <div className="flex-grow">
              <Input size="large" type="text" readOnly defaultValue={content} />
            </div>
            <span className="ml-3">
              <CopyBtn
                value={content}
                className="border border-gray-300 dark:border-[#232222] dark:text-white dark:hover:bg-[#333030] dark:focus:ring-gray-900 rounded-md dark:bg-[#232222]"
                />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
