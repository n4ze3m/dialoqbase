export interface ChatRequestBody {
  Params: {
    id: string;
  };
  Body: {
    message: string;
    history: [string, string][];
  };
}
