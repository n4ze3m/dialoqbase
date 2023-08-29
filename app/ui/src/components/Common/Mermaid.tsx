import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";
import { Tooltip } from "antd";
import { CheckIcon } from "@heroicons/react/24/solid";
import {
  ClipboardIcon,
  CloudArrowDownIcon,
  EyeSlashIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { useMessage } from "../../hooks/useMessage";
mermaid.initialize({
  startOnLoad: true,
  flowchart: {
    useMaxWidth: true,
  },
  logLevel: 0,
});
const Mermaid = React.memo((props: { code: string }) => {
  const ref: React.Ref<HTMLDivElement> = useRef(null);
  const [isError, setIsError] = React.useState(false);
  const [isBtnPressed, setIsBtnPressed] = React.useState(false);
  const [isBtnCopied, setIsBtnCopied] = React.useState(false);
  const [isBtnViewed, setIsBtnViewed] = React.useState(false);

  const { isProcessing } = useMessage();

  React.useEffect(() => {
    if (isBtnPressed) {
      setTimeout(() => {
        setIsBtnPressed(false);
      }, 4000);
    }
  }, [isBtnPressed]);

  React.useEffect(() => {
    if (isBtnCopied) {
      setTimeout(() => {
        setIsBtnCopied(false);
      }, 4000);
    }
  }, [isBtnCopied]);

  const renderMermaid = async () => {
    try {
      // check parse error

      const isError = await mermaid.parse(props.code);

      if (!isError) {
        setIsError(true);
        return;
      }

      const { svg } = await mermaid.render(
        "id" + Math.random().toString(36).substr(2, 9),
        props.code
      );

      if (ref.current != null) {
        ref.current.innerHTML = svg;
      }
    } catch (e) {
      setIsError(true);
    }
  };

  useEffect(() => {
    if (ref.current != null && !isProcessing) {
      renderMermaid();
    }
  }, [isBtnViewed, props.code, isProcessing]);

  return !isError ? (
    <div className="code relative border text-base bg-gray-800 rounded-md overflow-hidden text-white">
      <div className="flex items-center justify-between py-1.5 px-4">
        <span className="text-xs lowercase text-gray-200">Mermaid</span>

        <div className="flex items-center">
          <Tooltip title="Toggle preview">
            <button
              onClick={async () => {
                if (!isBtnViewed) {
                  await renderMermaid();
                }
                setIsBtnViewed(!isBtnViewed);
              }}
              className="flex gap-1.5 items-center rounded bg-none p-1 text-xs text-gray-200 hover:bg-gray-700 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-100"
            >
              {!isBtnViewed ? (
                <EyeIcon className="h-4 w-4" />
              ) : (
                <EyeSlashIcon className="h-4 w-4" />
              )}
            </button>
          </Tooltip>

          <Tooltip title="Download as SVG">
            <button
              onClick={() => {
                const svg = ref?.current?.innerHTML ?? "";
                const blob = new Blob([svg], {
                  type: "image/svg+xml;charset=utf-8",
                });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");

                link.href = url;
                link.download = `mermaid-${Date.now()}.svg`;
                link.click();

                setIsBtnPressed(true);
              }}
              className="flex gap-1.5 items-center rounded bg-none p-1 text-xs text-gray-200 hover:bg-gray-700 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-100"
            >
              {!isBtnPressed ? (
                <CloudArrowDownIcon className="h-4 w-4" />
              ) : (
                <CheckIcon className="h-4 w-4 text-green-400" />
              )}
            </button>
          </Tooltip>

          <Tooltip title="Copy to clipboard">
            <button
              onClick={() => {
                navigator.clipboard.writeText(props.code);
                setIsBtnCopied(true);
              }}
              className="flex gap-1.5 items-center rounded bg-none p-1 text-xs text-gray-200 hover:bg-gray-700 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-100"
            >
              {!isBtnCopied ? (
                <ClipboardIcon className="h-4 w-4" />
              ) : (
                <CheckIcon className="h-4 w-4 text-green-400" />
              )}
            </button>
          </Tooltip>
        </div>
      </div>

      {!isBtnViewed ? (
        <div ref={ref} className="py-3 text-md bg-white" />
      ) : (
        <SyntaxHighlighter
          {...props}
          children={String(props.code).replace(/\n$/, "")}
          style={nightOwl}
          key={Math.random()}
          customStyle={{
            margin: 0,
            fontSize: "1rem",
            lineHeight: "1.5rem",
          }}
          language="mermaid"
          codeTagProps={{
            className: "text-sm",
          }}
        />
      )}
    </div>
  ) : (
    <>
      <p className="bg-gray-300 text-gray-900 p-2 rounded-md text-sm">
        {props.code}
      </p>
      <span className="text-red-700 text-xs">
        Generated code is not valid mermaid code
      </span>
    </>
  );
});

export default Mermaid;
