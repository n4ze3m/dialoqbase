import { Tabs, Form } from "antd";
import React from "react";
import { useSpeechRecognition } from "react-speech-recognition";
import { SUPPORTED_LANGUAGES } from "../../../utils/languages";
import { useMutation } from "@tanstack/react-query";
import { useStoreMessage } from "../../../store";

export default function PlaygroundSettings({ close }: { close: () => void }) {
  const { browserSupportsSpeechRecognition } = useSpeechRecognition();

  const [showWarningWebspeech, setShowWarningWebspeech] = React.useState(false);
  const { setDefaultSpeechToTextLanguage, defaultSpeechToTextLanguage } =
    useStoreMessage();

  React.useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setShowWarningWebspeech(true);
    }
  }, [browserSupportsSpeechRecognition]);

  const onFinish = async (values: any) => {
    const language = values.language;
    setDefaultSpeechToTextLanguage(language);
    localStorage.setItem("defaultSpeechToTextLanguage", language);
  };

  const { mutate: saveTextToSpeech, isLoading: isSavingTextToSpeech } =
    useMutation(onFinish, {
      onSuccess: () => {
        close();
      },
    });
  return (
    <div>
      <Tabs defaultActiveKey="1" type="card">
        <Tabs.TabPane tab="Speech to Text" key="1">
          {showWarningWebspeech && (
            <div className="flex flex-col">
              <h1 className="font-semibold text-center text-gray-400 dark:text-gray-600">
                Web Speech API is not supported by your browser
              </h1>
              <p className="text-center text-gray-400 dark:text-gray-600">
                Please use Google Chrome or Microsoft Edge
              </p>
            </div>
          )}
          {!showWarningWebspeech && (
            <div>
              <Form
                initialValues={{ language: defaultSpeechToTextLanguage }}
                onFinish={saveTextToSpeech}
                layout="vertical"
              >
                <Form.Item label="Speech to Text Languages" name="language">
                  <select
                    className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
                    name="language"
                    id="language"
                  >
                    {SUPPORTED_LANGUAGES.map((language) => (
                      <option key={language.value} value={language.value}>
                        {language.label}
                      </option>
                    ))}
                  </select>
                </Form.Item>
                <Form.Item>
                  <button
                    disabled={isSavingTextToSpeech}
                    className="w-full h-10 placeholder-gray-600 border rounded-lg focus:shadow-outline  transition-all duration-200  bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    {isSavingTextToSpeech ? "Saving..." : "Save"}
                  </button>
                </Form.Item>
              </Form>
            </div>
          )}
        </Tabs.TabPane>
        {/* <Tabs.TabPane tab="Text to Speech" key="2">
          Content of Tab Pane 2
        </Tabs.TabPane> */}
      </Tabs>
    </div>
  );
}
