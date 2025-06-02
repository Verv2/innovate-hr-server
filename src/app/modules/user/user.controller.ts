import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import { UserService } from "./user.service";

const sendInvitation = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.sendInvitationToUser(req);
  const { password, ...resultData } = result;

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Invitation has been sent",
    data: resultData,
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

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsersFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieval successful",
    data: result,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getMeFromDB(req);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My Data retrieval successful",
    data: result,
  });
});

const requestForLeave = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.requestForLeave(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Your request has been sent successfully!",
    data: result,
  });
});

export const UserController = {
  sendInvitation,
  createUserProfile,
  getAllUsers,
  getMe,
  requestForLeave,
};
