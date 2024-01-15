export interface ChatRequestBody {
  Body: {
    username: string;
    password: string;
  };
}

export interface UpdateUsernameRequestBody {
  Body: {
    username: string;
    email: string;
  };
}

export interface UpdatePasswordRequestBody {
  Body: {
    oldPassword: string;
    newPassword: string;
  };
}

export interface RegisterUserRequestBody {
  Body: {
    username: string;
    email: string;
    password: string;
  };
}
