export type UpdateDialoqbaseSettingsRequest = {
  Body: {
    noOfBotsPerUser: number;
    allowUserToCreateBots: boolean;
    allowUserToRegister: boolean;
  };
};

export type ResetUserPasswordByAdminRequest = {
  Body: {
    user_id: number;
    new_password: string;
  };
};

export type RegisterUserbyAdminRequestBody = {
  Body: {
    username: string;
    email: string;
    password: string;
  };
};

// admin route type
export type FetchModelFromInputedUrlRequest = {
  Body: {
    url: string;
    api_key?: string;
  };
};
export type SaveModelFromInputedUrlRequest = {
  Body: {
    url: string;
    model_id: string;
    name: string;
    stream_available: boolean;
    api_key?: string;
  };
};

export type ToogleModelRequest = {
  Body: {
    id: number;
  };
};
