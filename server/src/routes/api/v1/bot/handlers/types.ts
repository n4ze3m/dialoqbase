export interface CreateBotRequest {
  Body: {
    name?: string;
    type: string;
    content: string;
  };
}
