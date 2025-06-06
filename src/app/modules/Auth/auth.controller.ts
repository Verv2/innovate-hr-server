import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { AuthService } from "./auth.service";
import config from "../../../config";
import sendResponse from "../../../shared/sendResponse";
import { ILoginUserResponse, IRefreshTokenResponse } from "./auth.interface";

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.loginUser(req.body);
  const { refreshToken } = result;
  // set refresh token into cookie
  const cookieOptions = {
    secure: config.env === "production",
    httpOnly: true,
  };

  res.cookie("refreshToken", refreshToken, cookieOptions);

  sendResponse<ILoginUserResponse>(res, {
    statusCode: 200,
    success: true,
    message: "User logged in successfully !",
    data: {
      accessToken: result.accessToken,
      refreshToken,
      needPasswordChange: result.needPasswordChange,
    },
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await AuthService.refreshToken(refreshToken);

  // set refresh token into cookie
  const cookieOptions = {
    secure: config.env === "production",
    httpOnly: true,
  };

  res.cookie("refreshToken", refreshToken, cookieOptions);

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: 200,
    success: true,
    message: "User logged in successfully !",
    data: result,
  });
});

const changePassword = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const { ...passwordData } = req.body;

    await AuthService.changePassword(user, passwordData);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Password changed successfully!",
      data: {
        status: 200,
        message: "Password changed successfully!",
      },
    });
  }
);

export const AuthController = {
  loginUser,
  refreshToken,
  changePassword,
};
