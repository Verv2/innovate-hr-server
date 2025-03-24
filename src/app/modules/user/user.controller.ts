import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import { UserService } from "./user.service";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createUserIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is created successfully!",
    data: result,
  });
});

const createUserProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createUserProfileIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile is created successfully!",
    data: result,
  });
});

export const UserController = {
  createUser,
  createUserProfile,
};
