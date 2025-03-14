import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import { UserService } from "./user.service";

// request and response are handled by controller
const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createUserIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User Created successfully!",
    data: result,
  });
});

export const UserController = {
  createUser,
};
