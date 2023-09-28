import { Form, Switch, Tabs } from "antd";
import React from "react";
import { SUPPORTED_LANGUAGES } from "../../../utils/languages";
import { useMutation } from "@tanstack/react-query";
import { useStoreMessage } from "../../../store";
import { useParams } from "react-router-dom";
import api from "../../../services/api";
import { useSpeechRecognition } from "../../../hooks/useSpeechRecognition";

export default function PlaygroundSettings({ close }: { close: () => void }) {
  const { supported: browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  const [webVoices, setWebVoices] = React.useState<SpeechSynthesisVoice[]>([]);

  const { voices, elevenLabsApiKeyPresent, elevenLabsApiKeyValid } =
    useStoreMessage();

  const [speechToTextForm] = Form.useForm();
  const [textToSpeechForm] = Form.useForm();

  const textToSpeechType = Form.useWatch("textToSpeechType", textToSpeechForm);

  const [showWarningWebspeech, setShowWarningWebspeech] = React.useState(false);
  const {
    setDefaultSpeechToTextLanguage,
    defaultSpeechToTextLanguage,
    defaultWebTextToSpeechLanguageType,
    textToSpeechEnabled,
    setTextToSpeechEnabled,
    defaultWebTextToSpeechLanguageWebAPI,
    elevenLabsDefaultVoice,

    setDefaultWebTextToSpeechLanguageWebAPI,
    setElevenLabsDefaultVoice,
    setDefaultWebTextToSpeechLanguageType,
  } = useStoreMessage();

  React.useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setShowWarningWebspeech(true);
    } else {
      setShowWarningWebspeech(false);
    }
  }, [browserSupportsSpeechRecognition]);

  const onFinish = async (values: any) => {
    const language = values.language;
    setDefaultSpeechToTextLanguage(language);
    localStorage.setItem("defaultSpeechToTextLanguage", language);
  };

  const { mutate: saveSpeechToText, isLoading: isSavingSpeechToText } =
    useMutation(onFinish, {
      onSuccess: () => {
        close();
      },
    });

  const params = useParams<{ id: string; history_id?: string }>();

  const onFinishTextToSpeech = async (values: any) => {
    const textToSpeechEnabled = values.textToSpeechEnabled;
    const textToSpeechType = values.textToSpeechType;
    await api.post(`bot/playground/${params.id}/voice`, {
      type: values.textToSpeechType,
      enabled: values.textToSpeechEnabled,
    });
    setDefaultWebTextToSpeechLanguageType(textToSpeechType);
    if (textToSpeechType === "web_api") {
      setDefaultWebTextToSpeechLanguageWebAPI(values.webApiDefaultVoice);
      localStorage.setItem(
        "defaultWebTextToSpeechLanguageWebAPI",
        values.webApiDefaultVoice
      );
    } else {
      setElevenLabsDefaultVoice(values.elevenLabsDefaultVoice);
      localStorage.setItem(
        "elevenLabsDefaultVoice",
        values.elevenLabsDefaultVoice
      );
    }
    setTextToSpeechEnabled(textToSpeechEnabled);
  };

  const { mutate: saveTextToSpeech, isLoading: isSavingTextToSpeech } =
    useMutation(onFinishTextToSpeech, {
      onSuccess: () => {
        close();
      },
    });

  React.useEffect(() => {
    const voices = window.speechSynthesis.getVoices();
    setWebVoices(voices);
  }, [textToSpeechType]);

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
                form={speechToTextForm}
                initialValues={{ language: defaultSpeechToTextLanguage }}
                onFinish={saveSpeechToText}
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
                    disabled={isSavingSpeechToText}
                    className="w-full h-10 placeholder-gray-600 border rounded-lg focus:shadow-outline  transition-all duration-200  bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    {isSavingSpeechToText ? "Saving..." : "Save"}
                  </button>
                </Form.Item>
              </Form>
            </div>
          )}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Text to Speech" key="2">
          <div>
            <Form
              initialValues={{
                textToSpeechEnabled: textToSpeechEnabled,
                textToSpeechType: defaultWebTextToSpeechLanguageType,

                elevenLabsDefaultVoice: elevenLabsDefaultVoice,
                webApiDefaultVoice: defaultWebTextToSpeechLanguageWebAPI,
              }}
              form={textToSpeechForm}
              onFinish={saveTextToSpeech}
              layout="vertical"
            >
              <Form.Item
                label="Enable or Disable Text to Speech"
                name="textToSpeechEnabled"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item
                label="Text to Speech Provider"
                name="textToSpeechType"
              >
                <select
                  className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
                  name="textToSpeechType"
                  id="textToSpeechType"
                >
                  <option value="web_api">Web API</option>
                  <option value="elevenlabs">ElevenLabs</option>
                </select>
              </Form.Item>

              {textToSpeechType === "web_api" && (
                <>
                  {window.speechSynthesis ? (
                    <>
                      <Form.Item
                        label="Text to Speech Voices"
                        name="webApiDefaultVoice"
                        rules={[
                          {
                            required: true,
                            message: "Please select a voice",
                          },
                        ]}
                      >
                        <select
                          className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
                          name="webApiDefaultVoice"
                          id="webApiDefaultVoice"
                        >
                          {webVoices.map((voice) => (
                            <option key={voice.name} value={voice.name}>
                              {voice.name}
                            </option>
                          ))}
                        </select>
                      </Form.Item>
                    </>
                  ) : (
                    <div>
                      <h1 className="font-semibold text-center text-gray-400 dark:text-gray-600">
                        Web Speech API is not supported by your browser
                      </h1>
                      <p className="text-center text-gray-400 dark:text-gray-600">
                        Please use Google Chrome or other browsers that support
                      </p>
                    </div>
                  )}
                </>
              )}

              {textToSpeechType === "elevenlabs" && (
                <>
                  {!elevenLabsApiKeyPresent && (
                    <div>
                      <h1 className="font-semibold text-center text-gray-400 dark:text-gray-600">
                        Eleven Labs API Key is not present
                      </h1>
                      <p className="text-center text-gray-400 dark:text-gray-600">
                        Please add it in{" "}
                        <code className="text-gray-400 dark:text-gray-600">
                          .env
                        </code>{" "}
                        file
                      </p>
                    </div>
                  )}
                  {elevenLabsApiKeyPresent && !elevenLabsApiKeyValid && (
                    <div>
                      <h1 className="font-semibold text-center text-gray-400 dark:text-gray-600">
                        Eleven Labs API Key is not valid
                      </h1>
                      <p className="text-center text-gray-400 dark:text-gray-600">
                        Please add it in{" "}
                        <code className="text-gray-400 dark:text-gray-600">
                          .env
                        </code>{" "}
                        file
                      </p>
                    </div>
                  )}
                  {elevenLabsApiKeyPresent && elevenLabsApiKeyValid && (
                    <>
                      <Form.Item
                        label="Text to Speech Voices"
                        name="elevenLabsDefaultVoice"
                        rules={[
                          {
                            required: true,
                            message: "Please select a voice",
                          },
                        ]}
                      >
                        <select
                          className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
                          name="elevenLabsDefaultVoice"
                          id="elevenLabsDefaultVoice"
                        >
                          {voices.map((voice) => (
                            <option key={voice.voice_id} value={voice.voice_id}>
                              {voice.name}
                            </option>
                          ))}
                        </select>
                      </Form.Item>
                    </>
                  )}
                </>
              )}
              <Form.Item>
                <button
                  type="submit"
                  disabled={isSavingTextToSpeech}
                  className="w-full h-10 placeholder-gray-600 border rounded-lg focus:shadow-outline  transition-all duration-200  bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  {isSavingTextToSpeech ? "Saving..." : "Save"}
                </button>
              </Form.Item>
            </Form>
          </div>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}
