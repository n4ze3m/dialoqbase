export type UpdateDialoqbaseSettingsRequest = {
  Body: {
    noOfBotsPerUser: number;
    allowUserToCreateBots: boolean;
    allowUserToRegister: boolean;
  };
};
