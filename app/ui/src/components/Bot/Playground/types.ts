export type BotPlaygroundHistory = {
  streaming: boolean;
  history: PlaygroundHistory[];
  other_details?: PlaygroundHistory | null;
  messages: BotPlaygroundMessageType[];
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
