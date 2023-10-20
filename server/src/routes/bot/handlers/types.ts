export interface ChatRequestBody {
  Params: {
    id: string;
  };
  Body: {
    message: string;
    history_id: string;
    history: {
      type: string;
      text: string;
    }[];
  };
}

export interface ChatRequestQuery {
  Params: {
    id: string;
  };

  Querystring: {
    message: string;
    history: string;
  };
}

export interface ChatStyleRequest {
  Params: {
    id: string;
  };
}

export interface ChatAPIRequest {
  Headers: {
    "x-api-key": string;
  };
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
