export interface CreateBotRequest {
  Body: {
    name?: string;
    type?: string;
    content?: string;
    embedding: string;
    model: string;
    maxDepth?: number;
    maxLinks?: number;
    options?: any;
  };
}

export interface GetBotRequestById {
  Params: {
    id: string;
  };
}

export interface AddNewSourceById {
  Params: {
    id: string;
  };
  Body: {
    type: string;
    content: string;
    maxDepth?: number;
    maxLinks?: number;
    options?: any;
  };
}

export interface AddNewPDFById {
  Params: {
    id: string;
  };
}

export interface UploadPDF {

  Querystring: {
    embedding: string;
    model: string;
  };
}

export interface GetSourceByIds {
  Params: {
    id: string;
    sourceId: string;
  };
}

export interface UpdateBotById {
  Params: {
    id: string;
  };
  Body: {
    name: string;
    temperature: number;
    model: string;
    qaPrompt: string;
    questionGeneratorPrompt: string;
    streaming: boolean;
    showRef: boolean;
    use_hybrid_search: boolean;
    bot_protect: boolean;
    use_rag: boolean;
    bot_model_api_key: string
  };
}
