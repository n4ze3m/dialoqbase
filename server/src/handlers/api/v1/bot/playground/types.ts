export interface ChatRequestBody {
  Params: {
    id: string;
  };
  Body: {
    message: string;
    history: {
      type: string;
      text: string;
    }[];
    history_id?: string;
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

export interface GetPlaygroundBotById {
  Params: {
    id: string;
  };
}

export interface GetPlaygroundBotByIdAndHistoryId {
  Params: {
    id: string;
    history_id: string;
  };
}

export interface UpdateBotAudioSettings {
  Params: {
    id: string;
  };
  Body: {
    type: string;
    enabled: boolean;
  };
}
