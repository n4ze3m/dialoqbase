export interface ChatRequestBody {
  Body: {
    username: string;
    password: string;
  };
}

export interface UpdateUsernameRequestBody {
  Body: {
    username: string;
  };
}


export interface UpdatePasswordRequestBody {
  Body: {
    oldPassword: string;
    newPassword: string;
  };
}