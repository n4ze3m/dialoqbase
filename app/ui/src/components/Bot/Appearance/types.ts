export interface AppearanceType {
  public_id: string;
  data: {
    background_color?: string;
    bot_name: string;
    chat_bot_bubble_style?: {
      background_color?: string;
      text_color?: string;
    };
    chat_human_bubble_style?: {
      background_color?: string;
      text_color?: string;
    };
    first_message: string;
    tts: boolean;
    tts_voice: string | null;
    tts_provider: string | null;
  };
  tts_data: {
    eleven_labs: {
      models: {
        label: string;
        value: string;
      }[];
      voices: {
        label: string;
        value: string;
      }[];
    };
    openai: {
      models: {
        label: string;
        value: string;
      }[];
      voices: {
        label: string;
        value: string;
      }[];
    };
  };
}
