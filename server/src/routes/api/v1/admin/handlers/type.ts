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
}

export type RegisterUserbyAdminRequestBody = {
  Body: {
    username: string;
    email: string;
    password: string;
  }
}