import { Request, RequestHandler, Response } from "express";
import { UserServices } from "./user.service";
import sendResponse from "../../../utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const { user: userData } = req.body;

  // will call service function to send this data
  const result = await UserServices.createUserIntoDB(userData);

  //send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User is created successfully!",
    data: result,
  });
});

const getAllUsers: RequestHandler = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUsersFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users are retrieved successfully",
    meta: result.meta,
    data: result.result,
  });
});

export const UserControllers = {
  createUser,
  getAllUsers,
};
