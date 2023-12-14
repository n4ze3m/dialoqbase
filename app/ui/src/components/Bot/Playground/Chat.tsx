import React from "react";
import { useMessage } from "../../../hooks/useMessage";
import { PlaygroundMessage } from "./Message";
import { Modal } from "antd";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { COMMON_PROGRAMMING_LANGUAGES_EXTENSIONS } from "../../../utils/languges";
import { removeUUID } from "../../../utils/filename";
import { useStoreMessage } from "../../../store";

export const PlaygroundChat = () => {
  const { messages } = useMessage();
  const { textToSpeechEnabled, defaultWebTextToSpeechLanguageType } =
    useStoreMessage();
  const divRef = React.useRef<HTMLDivElement>(null);

  const [sourceData, setSourceData] = React.useState<any>(null);
  const [openSource, setOpenSource] = React.useState(false);
  const [fileType, setFileType] = React.useState<
    "pdf" | "mp3" | "mp4" | "other" | "lang"
  >("other");

  React.useEffect(() => {
    if (divRef.current) {
      divRef.current.scrollIntoView({ behavior: "smooth" });
    }
  });
  return (
    <div className=" flex flex-col md:translate-x-0 transition-transform duration-300 ease-in-out">
      <div className="relative w-full transition-width flex flex-col overflow-hidden items-stretch flex-1">
        <div className="flex-1">
          <div className="h-full ">
            <div className="">
              <div className="grow">
                {messages.length === 0 && (
                  <div>
                    {" "}
                    <h1 className="text-2xl sm:text-4xl font-semibold text-center text-gray-400 dark:text-gray-600 flex gap-2 items-center justify-center h-screen">
                      Dialoqbase Playground
                    </h1>
                  </div>
                )}
                {messages.map((message, index) => (
                  <PlaygroundMessage
                    key={index}
                    {...message}
                    onSourceClick={(source) => {
                      const fileInfo = `${
                        source?.metadata?.path || source?.metadata?.source
                      }`;
                      const fileExtension = fileInfo.split(".").pop();
                      if (fileExtension === "pdf") {
                        setFileType("pdf");
                      } else if (
                        fileExtension === "mp3" ||
                        fileExtension === "wav"
                      ) {
                        setFileType("mp3");
                      } else if (fileExtension === "mp4") {
                        setFileType("mp4");
                      } else {
                        const isExist =
                          COMMON_PROGRAMMING_LANGUAGES_EXTENSIONS[
                            `${
                              source?.metadata?.path || source?.metadata?.source
                            }`
                              .split(".")
                              .pop() ||
                              ("" as keyof typeof COMMON_PROGRAMMING_LANGUAGES_EXTENSIONS)
                          ];

                        if (isExist) {
                          setFileType("lang");
                        } else {
                          setFileType("other");
                        }
                      }
                      setSourceData(source);
                      setOpenSource(true);
                    }}
                    textToSpeech={textToSpeechEnabled}
                    textToSpeechType={defaultWebTextToSpeechLanguageType}
                  />
                ))}
                <div className="w-full h-32 md:h-48 flex-shrink-0"></div>

                <div ref={divRef} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={openSource}
        // mask={false}
        zIndex={10000}
        onCancel={() => setOpenSource(false)}
        footer={null}
        onOk={() => setOpenSource(false)}
      >
        <div className="flex flex-col gap-2 mt-6">
          <h4 className="bg-gray-100 text-md dark:bg-gray-800 text-gray-800 dark:text-gray-100 font-semibold p-2">
            {removeUUID(
              `${
                sourceData?.metadata?.path || sourceData?.metadata?.source
              }`.replace("./uploads/", "")
            )}
          </h4>
          {fileType === "pdf" && (
            <>
              <p className="text-gray-500 text-sm">{sourceData?.pageContent}</p>

              <div className="flex flex-wrap gap-3">
                <span className="border border-gray-300 dark:border-gray-700 rounded-md p-1 text-gray-500 text-xs">
                  {`Page ${sourceData?.metadata?.loc?.pageNumber}`}
                </span>

                <span className="border border-gray-300 dark:border-gray-700 rounded-md p-1 text-xs text-gray-500">
                  {`Line ${sourceData?.metadata?.loc?.lines?.from} - ${sourceData?.metadata?.loc?.lines?.to}`}
                </span>
              </div>
            </>
          )}

          {fileType === "other" && (
            <>
              <p className="text-gray-500 text-sm">{sourceData?.pageContent}</p>
            </>
          )}
          {fileType === "lang" && (
            <>
              <SyntaxHighlighter
                startingLineNumber={sourceData?.metadata?.loc?.lines?.from}
                showLineNumbers={true}
                language={
                  COMMON_PROGRAMMING_LANGUAGES_EXTENSIONS[
                    `${
                      sourceData?.metadata?.path || sourceData?.metadata?.source
                    }`
                      .split(".")
                      .pop() ||
                      ("" as keyof typeof COMMON_PROGRAMMING_LANGUAGES_EXTENSIONS)
                  ]
                }
                style={nightOwl}
                customStyle={{
                  margin: 0,
                  fontSize: "1rem",
                  lineHeight: "1.5rem",
                }}
                codeTagProps={{
                  className: "text-sm",
                }}
              >
                {sourceData?.pageContent}
              </SyntaxHighlighter>
            </>
          )}
          {fileType === "mp3" && (
            <>
              <p className="text-gray-500 text-sm">{sourceData?.pageContent}</p>

              <div className="flex flex-wrap gap-3">
                <span className="border border-gray-300 dark:border-gray-700 rounded-md p-1 text-xs text-gray-500">
                  {`Line ${sourceData?.metadata?.loc?.lines?.from} - ${sourceData?.metadata?.loc?.lines?.to}`}
                </span>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};
