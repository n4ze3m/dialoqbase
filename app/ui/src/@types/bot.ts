export type BotSettings = {
  id: string;
  name: string;
  model: string;
  public_id: string;
  temperature: number;
  embedding: string;
  qaPrompt: string;
  questionGeneratorPrompt: string;
  streaming: boolean;
  showRef: boolean;
  use_hybrid_search: boolean;
  bot_protect: boolean;
  use_rag: boolean;
};


export type BotIntegrationAPI = {
  is_api_enabled: boolean;
  data: {
    public_url: string | null;
    api_key: string | null;
  };
}