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

export interface AddNewSourceBulkById {
  Params: {
    id: string;
  };
  Body: {
    type: string;
    content: string;
    maxDepth?: number;
    maxLinks?: number;
    options?: any;
  }[];
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
    name?: string;
    temperature?: number;
    model?: string;
    qaPrompt?: string;
    questionGeneratorPrompt?: string;
    streaming?: boolean;
    showRef?: boolean;
    use_hybrid_search?: boolean;
    bot_protect?: boolean;
    use_rag?: boolean;
    bot_model_api_key?: string
  };
}


export interface GetBotById {
  Params: {
    bot_id: string;
  };
}


export interface CreateBotAPIRequest {
  Body: {
    name?: string;
    embedding: string;
    model: string;
    system_prompt?: string;
    question_generator_prompt?: string;
    temperature?: number;
  };
}

export interface UpdateBotAPIById {
  Params: {
    id: string;
  };
  Body: {
    system_prompt?: string;
    question_generator_prompt?: string;
    name?: string;
    temperature?: number;
    model?: string;
    streaming?: boolean;
    showRef?: boolean;
    use_hybrid_search?: boolean;
    bot_protect?: boolean;
    use_rag?: boolean;
    bot_model_api_key?: string
  };
}



export interface ChatAPIRequest {
  Params: {
    id: string;
  };
  Body: {
    message: string;
    stream: string;
    history_id?: string;
    history: {
      role: string;
      text: string;
    }[];
  };
}