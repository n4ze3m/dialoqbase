export interface ChatIntergationHistoryByTypeRequest {
  Params: {
    id: string;
    type: string;
  };
}

export interface ChatIntergationHistoryByChatIdRequest {
    Params: {
        id: string;
        type: string;
        chat_id: string;
    }
}