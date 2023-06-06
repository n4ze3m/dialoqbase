export interface ChatRequestBody {
  Params: {
    id: string;
  };
  Body: {
    message: string;
    history: {
      type: string,
      text: string,
    }[];
  };
}
