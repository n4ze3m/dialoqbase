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
};

export type DeleteIntergationType = {
  Params: {
    id: string;
  };
  Body: {
    provider: string;
  };
};

export type GetChannelsByProviderType = {
  Params: {
    id: string;
  };
};

export type GetIntergationType = {
  name?: string;
  channel?: string;
  logo?: string;
  link?: string;
  description?: string;
  fields: {
    name: string;
    type: string;
    title: string;
    inputType: string;
    description: string;
    help: string;
    requiredMessage: string;
    value: string | boolean;
    defaultValue: string | boolean;
  }[];
  isPaused?: boolean;
  status?: string;
  color?: string;
  textColor?: string;
  connectBtn?: {
    text: string;
    link: string;
  } | null;
};


export type WhatsAppIntergationType = {
  Querystring: {
    "hub.verify_token": string;
    "hub.mode": string;
    "hub.challenge": string;
  },
  Params: {
    id: string;
  }
}

export type WhatsAppIntergationBodyType = {
  Params: {
    id: string;
  },
  Headers: {
    "x-hub-signature": string;
  }
  Body: Record<string, any>; 
}


export type GetAPIIntergationRequest  = {
  Params: {
    id: string;
  };
}