import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import remarkGfm from "remark-gfm";
import { nightOwl } from "react-syntax-highlighter/dist/cjs/styles/prism";
import rehypeMathjax from "rehype-mathjax";
import remarkMath from "remark-math";
// import remhypeMrmaid from "rehype-mermaidjs"
import ReactMarkdown from "react-markdown";
import { ClipboardIcon, CheckIcon, EyeIcon } from "@heroicons/react/24/outline";
import React from "react";
import { Modal, Tooltip } from "antd";
import Mermaid from "./Mermaid";
import { useMessage } from "../../hooks/useMessage";

export default function Markdown({ message }: { message: string }) {
  const [isBtnPressed, setIsBtnPressed] = React.useState(false);
  const [isOpenHTML, setIsOpenHTML] = React.useState(false);
  const [html, setHtml] = React.useState("");

  // const { isProcessing } = useMessage();

  React.useEffect(() => {
    if (isBtnPressed) {
      setTimeout(() => {
        setIsBtnPressed(false);
      }, 4000);
    }
  }, [isBtnPressed]);
  const { isProcessing } = useMessage();

  return (
    <React.Fragment>
      <ReactMarkdown
        className="prose break-words dark:prose-invert text-sm prose-p:leading-relaxed prose-pre:p-0 dark:prose-dark"
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeMathjax]}
        components={{
          code({ node, inline, className, children, ...props }) {
            // // if language is mermaid
            if (className === "language-mermaid" && !isProcessing) {
              return <Mermaid code={children[0] as string} />;
            }
            const match = /language-(\w+)/.exec(className || "");
            const isHTML = /language-html/.exec(className || "") !== null;
            return !inline ? (
              <div className="code relative text-base bg-gray-800 rounded-md overflow-hidden">
                <div className="flex items-center justify-between py-1.5 px-4">
                  <span className="text-xs lowercase text-gray-200">
                    {className && className.replace("language-", "")}
                  </span>

                  <div className="flex items-center">
                    {isHTML && (
                      <Tooltip title="Preview HTML">
                        <button
                          onClick={() => {
                            setIsOpenHTML(true);
                            setHtml(children[0] as string);
                          }}
                          className="flex gap-1.5 items-center rounded bg-none p-1 text-xs text-gray-200 hover:bg-gray-700 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-100"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                      </Tooltip>
                    )}
                    <Tooltip title="Copy to clipboard">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(children[0] as string);
                          setIsBtnPressed(true);
                        }}
                        className="flex gap-1.5 items-center rounded bg-none p-1 text-xs text-gray-200 hover:bg-gray-700 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-100"
                      >
                        {!isBtnPressed ? (
                          <ClipboardIcon className="h-4 w-4" />
                        ) : (
                          <CheckIcon className="h-4 w-4 text-green-400" />
                        )}
                      </button>
                    </Tooltip>
                  </div>
                </div>
                <SyntaxHighlighter
                  {...props}
                  children={String(children).replace(/\n$/, "")}
                  style={nightOwl}
                  key={Math.random()}
                  customStyle={{
                    margin: 0,
                    fontSize: "1rem",
                    lineHeight: "1.5rem",
                  }}
                  language={(match && match[1]) || ""}
                  codeTagProps={{
                    className: "text-sm",
                  }}
                />
              </div>
            ) : (
              <code className={`${className} font-semibold`} {...props}>
                {children}
              </code>
            );
          },
          a({ node, ...props }) {
            return (
              <a
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 text-sm hover:underline"
                {...props}
              >
                {props.children}
              </a>
            );
          },
          p({ children }) {
            return <p className="mb-2 last:mb-0">{children}</p>;
          },
        }}
      >
        {message}
      </ReactMarkdown>

      <Modal
        open={isOpenHTML}
        onCancel={() => setIsOpenHTML(false)}
        footer={null}
        width="90%"
      >
        <div className="p-6">
        <iframe
          srcDoc={html}
          className="w-full"
          title="Preview HTML"
          height={window.innerHeight / 2 > 500 ? window.innerHeight / 2 : 500}
        ></iframe>
        </div>
      </Modal>
    </React.Fragment>
  );
}
