export type ConversationsByType = {
  chat_id: string;
  metdata: {
    user_agent?: string;
    ip?: string;
  };
  human: string | null;
  bot: string | null;
  created_at: Date;
  all_messages: {
    isBot: boolean;
    message?: string | null | undefined;
    sources?: any;
    createdAt: Date;
  }[];
};
