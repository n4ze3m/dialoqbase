export interface CreateBotRequest {
  Body: {
    name?: string;
    type: string;
    content: string;
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
  }
}

export interface AddNewPDFById {
  Params: {
    id: string;
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
  }
}