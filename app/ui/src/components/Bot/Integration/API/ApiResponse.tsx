import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vsDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

type Props = {
  status: string;
  data: string;
};

export const ApiResponse: React.FC<Props> = ({ status, data }) => {
  return (
    <div>
      <div className="flex flex-row justify-end">
        <span className="text-sm text-blue-500">{status}</span>
      </div>

      <div className="flex flex-row justify-end">
        <SyntaxHighlighter
          language="json"
          style={vsDark}
          customStyle={{
            margin: 0,
            fontSize: "1rem",
            lineHeight: "1.5rem",
          }}
          codeTagProps={{
            className: "text-sm",
          }}
        >
          {data}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};
