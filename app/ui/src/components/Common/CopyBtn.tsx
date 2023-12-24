import React, { useState } from "react";
import { ClipboardIcon, CheckIcon } from "@heroicons/react/24/outline";
import { clcx } from "../../utils/classname";

type Props = {
  value: string;
  showText?: boolean;
  iconSize?: string;
  className?: string;
};

export const CopyBtn: React.FC<Props> = ({
  value,
  showText = true,
  iconSize = "w-6 h-6",
  className = "",
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={clcx(
        className,
        "flex items-center justify-center p-2 transition-colors duration-200 rounded  focus:outline-none focus:ring focus:ring-opacity-50"
      )}
    >
      {copied ? (
        <>
          <CheckIcon className={iconSize + " mr-1 text-green-500"} />
          {showText && <span className="text-green-500">Copied</span>}
        </>
      ) : (
        <>
          <ClipboardIcon className={iconSize + " mr-1 text-gray-500"} />
          {showText && <span className="text-gray-500">Copy</span>}
        </>
      )}
    </button>
  );
};
