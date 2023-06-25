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
    }
}