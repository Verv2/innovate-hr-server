import { Request, Response } from "express";
import { userService } from "./user.service";
import catchAsync from "../../../shared/catchAsync";
import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";

// request and response are handled by controller
const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createAdmin();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin Created successfully!",
    data: result,
  });
});

export const userController = {
  createAdmin,
};
