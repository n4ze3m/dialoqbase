export type BotStyle = {
  data: {
    background_color?: string;
    bot_name: string;
    streaming: boolean;
    show_reference: boolean;
    chat_bot_bubble_style?: {
      background_color?: string;
      text_color?: string;
    };
    chat_human_bubble_style?: {
      background_color?: string;
      text_color?: string;
    };
    first_message: string;
  };
};
