import React, { useState } from "react";
import { ClipboardIcon, CheckIcon } from "@heroicons/react/24/outline";

type Props = {
  value: string;
  showText?: boolean;
};

export const CopyBtn: React.FC<Props> = ({ value, showText = true }) => {
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
      className="flex items-center justify-center p-2 transition-colors duration-200 rounded hover:bg-gray-100 focus:outline-none focus:ring focus:ring-opacity-50"
    >
      {copied ? (
        <>
          <CheckIcon className="w-6 h-6 mr-1 text-green-500" />
          {showText && <span className="text-green-500">Copied</span>}
        </>
      ) : (
        <>
          <ClipboardIcon className="w-6 h-6 mr-1 text-gray-500" />
          {showText && <span className="text-gray-500">Copy</span>}
        </>
      )}
    </button>
  );
};
