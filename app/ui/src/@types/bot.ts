export type BotSettings = {
  data: {
    id: string;
    name: string;
    model: string;
    public_id: string;
    temperature: number;
    embedding: string;
    noOfDocumentsToRetrieve: number;
    qaPrompt: string;
    questionGeneratorPrompt: string;
    streaming: boolean;
    showRef: boolean;
    use_hybrid_search: boolean;
    publicBotPwdProtected: boolean;
    publicBotPwd: string;
    bot_protect: boolean;
    use_rag: boolean;
    bot_model_api_key: string;
    noOfChatHistoryInContext: number;
    semanticSearchSimilarityScore: string;
    inactivityTimeout: number;
    autoResetSession: boolean;
    autoSyncDataSources: boolean;
    internetSearchEnabled: boolean;
    internalSearchEnabled: boolean;
  };
  chatModel: {
    label: string;
    value: string;
    stream: boolean;
  }[];
  embeddingModel: {
    label: string;
    value: string;
  }[];
};

export type BotIntegrationAPI = {
  is_api_enabled: boolean;
  data: {
    public_url: string | null;
    api_key: string | null;
  };
};


export type BotConfig = {
  chatModel: {
    label: string;
    value: string;
    stream: string;
  }[];
  embeddingModel: {
    label: string;
    value: string;
  }[];
  defaultChatModel?: string;
  defaultEmbeddingModel?: string;
  fileUploadSizeLimit: number;
}