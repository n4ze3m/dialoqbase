export type createIntergationType = {
  Params: {
    id: string;
  };
  Body: {
    provider: string;
    value: any;
  };
};


export type PauseIntergationType = {
  Params: {
    id: string;
  };
  Body: {
    provider: string;
  };
}



export type DeleteIntergationType = {
  Params: {
    id: string;
  };
  Body: {
    provider: string;
  };
}



export type GetChannelsByProviderType = {
  Params: {
    id: string;
  };
}