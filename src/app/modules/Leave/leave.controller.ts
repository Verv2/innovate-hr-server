import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { LeaveService } from "./leave.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";

const requestForLeave = catchAsync(async (req: Request, res: Response) => {
  const result = await LeaveService.requestForLeave(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Your request has been sent successfully!",
    data: result,
  });
});

const approveLeaveRequest = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await LeaveService.approveLeaveRequest(payload);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `The request has been ${payload.status}`,
    data: result,
  });
});

const getLeavesOnToday = catchAsync(async (req: Request, res: Response) => {
  const result = await LeaveService.getLeavesOnTodayFormDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Employees on leave today have been retrieved",
    data: result,
  });
});

export const LeaveController = {
  requestForLeave,
  approveLeaveRequest,
  getLeavesOnToday,
};
