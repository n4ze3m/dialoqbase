export type BotPlaygroundHistory = {
  streaming: boolean;
  history: PlaygroundHistory[];
  other_details?: PlaygroundHistory | null;
  messages: BotPlaygroundMessageType[];
  text_to_speech_type: string;
  text_to_speech_settings?: {
    elevenlabs_api_key?: string;
    voice?: string;
  };
  text_to_speech_enabled: boolean;
  eleven_labs_api_key_present: boolean;
  eleven_labs_api_key_valid: boolean;
  voices: {
    voice_id: string;
    name: string;
  }[];
};

export type PlaygroundHistory = {
  title: string;
  id: string;
};

export type BotPlaygroundMessageType = {
  type: string;
  message: string;
  createdAt: string;
  isBot: boolean;
  sources: any[];
};
