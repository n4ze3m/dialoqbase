import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { CopyBtn } from "../../../Common/CopyBtn";

export const CodePreview: React.FC<{ code: string; lang: string }> = ({
  code,
  lang,
}) => {
  return (
    <div className="code relative text-base bg-gray-800 rounded-md overflow-hidden">
      <div className="flex items-center justify-end py-1.5 px-4">
        <CopyBtn showText={false} iconSize="h-4 w-4" value={code} />
      </div>
      <SyntaxHighlighter
        children={String(code).replace(/\n$/, "")}
        style={nightOwl}
        key={Math.random()}
        showLineNumbers
        customStyle={{
          margin: 0,
          fontSize: "1rem",
          lineHeight: "1.5rem",
        }}
        language={lang}
        codeTagProps={{
          className: "text-sm",
        }}
      />
    </div>
  );
};

interface APICodeGeneratorProps {
  api: string;
  xApiKey: string;
  body: string;
}

const APICodeGenerator: React.FC<APICodeGeneratorProps> = ({
  api,
  xApiKey,
  body,
}) => {
  const [codes, setCodes] = useState({
    curlCode: "",
    nodeCode: "",
    pythonCode: "",
    goCode: "",
  });

  useEffect(() => {
    const newCurlCode = `curl --request POST \\
     --url ${api} \\
     --header 'content-type: application/json' \\
     --header 'x-api-key: ${xApiKey}' \\
     --data '${body}'
    `;

    const newNodeCode = `const axios = require('axios');

axios.post('${api}', ${body}, {
  headers: {
    'content-type': 'application/json',
    'x-api-key': '${xApiKey}'
  }
});
    `;

    const newPythonCode = `import requests

headers = {
    'content-type': 'application/json',
    'x-api-key': '${xApiKey}'
}

response = requests.post('${api}', headers=headers, json=${body})
    `;

    const newGoCode = `package main

import (
	"bytes"
	"net/http"
)

func main() {
	body := []byte(\`${body}\`)
	req, _ := http.NewRequest("POST", "${api}", bytes.NewBuffer(body))
	req.Header.Set("content-type", "application/json")
	req.Header.Set("x-api-key", "${xApiKey}")

	client := &http.Client{}
	resp, _ := client.Do(req)
	defer resp.Body.Close()
}
    `;

    setCodes({
      curlCode: newCurlCode,
      nodeCode: newNodeCode,
      pythonCode: newPythonCode,
      goCode: newGoCode,
    });
  }, [api, xApiKey, body]);

  return (
    <div>
      <Tabs
        type="card"
        items={[
          {
            label: (
              <div>
                <span className="text-sm font-semibold">curl</span>
                <img src="/code/curl.png" className=" h-4 ml-2 inline-block" />
              </div>
            ),
            key: "curl",
            children: <CodePreview code={codes.curlCode} lang="bash" />,
          },
          {
            label: (
              <div>
                <span className="text-sm font-semibold">node</span>
                <img src="/code/node.png" className=" h-4 ml-2 inline-block" />
              </div>
            ),
            key: "node",
            children: <CodePreview code={codes.nodeCode} lang="javascript" />,
          },
          {
            label: (
              <div>
                <span className="text-sm font-semibold">python</span>
                <img src="/code/python.png" className="h-4 ml-2 inline-block" />
              </div>
            ),
            key: "python",
            children: <CodePreview code={codes.pythonCode} lang="python" />,
          },
          {
            label: (
              <div>
                <span className="text-sm font-semibold">go</span>
                <img src="/code/go.png" className="h-4 ml-2 inline-block" />
              </div>
            ),
            key: "go",
            children: <CodePreview code={codes.goCode} lang="go" />,
          },
        ]}
      />
    </div>
  );
};

export default APICodeGenerator;
