export interface CreateBotRequest {
  Body: {
    name?: string;
    type: string;
    content: string;
    embedding: string;
    model: string;
    maxDepth?: number;
    maxLinks?: number;
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
  };
}

export interface AddNewPDFById {
  Params: {
    id: string;
    type: string;
  };
}

export interface UploadPDF {
  Params: {
    type: string;
  },
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
  };
}
