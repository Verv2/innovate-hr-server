import { UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { ILoginUser, ILoginUserResponse } from "./auth.interface";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiErrors";
import { AuthUtils } from "./auth.utils";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import { Secret } from "jsonwebtoken";

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload;

  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
      status: UserStatus.ACTIVE,
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
  }

  if (
    isUserExist.password &&
    !(await AuthUtils.comparePasswords(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password is incorrect");
  }

  const { id: userId, role, needPasswordChange } = isUserExist;

  const accessToken = jwtHelpers.createToken(
    { userId, role, email },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.createToken(
    { userId, role },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange,
  };
};

export const AuthService = {
  loginUser,
};
