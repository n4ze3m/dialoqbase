import { FastifyReply, FastifyRequest } from "fastify";
import {
  ChatRequestBody,
  UpdatePasswordRequestBody,
  UpdateUsernameRequestBody,
} from "./types";
import * as bcrypt from "bcryptjs";

export const userLoginHandler = async (
  request: FastifyRequest<ChatRequestBody>,
  reply: FastifyReply,
) => {
  const { username, password } = request.body;

  const user = await request.server.prisma.user.findFirst({
    where: {
      username: username,
    },
  });

  if (!user) {
    return reply.status(404).send({
      message: "User not found",
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return reply.status(400).send({
      message: "Invalid password",
    });
  }

  const token = request.server.jwt.sign({
    user_id: user.user_id,
    username: user.username,
  });

  const isFirstLogin = user.isFirstLogin;

  if (isFirstLogin) {
    await request.server.prisma.user.update({
      where: {
        user_id: user.user_id,
      },
      data: {
        isFirstLogin: false,
      },
    });
  }

  return reply.status(200).send({
    message: isFirstLogin
      ? "Login successful, please change your password"
      : "Login successful",
    token,
    user: {
      user_id: user.user_id,
      username: user.username,
    },
    to: isFirstLogin ? "/settings" : "/",
  });
};

export const updateUsernameHandler = async (
  request: FastifyRequest<UpdateUsernameRequestBody>,
  reply: FastifyReply,
) => {
  const user = request.user;

  await request.server.prisma.user.update({
    where: {
      user_id: user.user_id,
    },
    data: {
      username: request.body.username,
    },
  });

  return reply.status(200).send({
    message: "Username updated successfully",
  });
};

export const updatePasswordHandler = async (
  request: FastifyRequest<UpdatePasswordRequestBody>,
  reply: FastifyReply,
) => {
  const user = request.user;

  const userDetails = await request.server.prisma.user.findFirst({
    where: {
      user_id: user.user_id,
    },
  });

  if (!userDetails) {
    return reply.status(404).send({
      message: "User not found",
    });
  }

  const isPasswordValid = await bcrypt.compare(
    request.body.oldPassword,
    userDetails.password,
  );

  if (!isPasswordValid) {
    return reply.status(400).send({
      message: "Invalid password",
    });
  }

  const hashedPassword = await bcrypt.hash(request.body.newPassword, 12);

  await request.server.prisma.user.update({
    where: {
      user_id: user.user_id,
    },
    data: {
      password: hashedPassword,
    },
  });

  return reply.status(200).send({
    message: "Password updated successfully",
  });
};
