import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { EmployeeService } from "./employee.service";
import httpStatus from "http-status";
import { TEmployee } from "./employee.interface";

const addEmployee = catchAsync(async (req: Request, res: Response) => {
  const result = await EmployeeService.addEmployeeIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Employee has been added successfully!",
    data: result,
  });
});

export const EmployeeController = {
  addEmployee,
};
