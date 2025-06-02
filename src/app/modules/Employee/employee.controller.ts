import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { EmployeeService } from "./employee.service";
import httpStatus from "http-status";
import { TEmployee } from "./employee.interface";
import pick from "../../../shared/pick";
import { employeeFilterableFields } from "./employee.constant";

const addEmployee = catchAsync(async (req: Request, res: Response) => {
  const result = await EmployeeService.addEmployeeIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Employee has been added successfully!",
    data: result,
  });
});

const addTemporaryEmployee = catchAsync(async (req: Request, res: Response) => {
  const result = await EmployeeService.addTemporaryEmployeeIntoDB(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Employee has been added successfully!",
    data: result,
  });
});

const getTemporaryEmployee = catchAsync(
  async (req: Request & { user?: { userId: string } }, res: Response) => {
    const userId = req.user?.userId;

    const result = await EmployeeService.getTemporaryEmployeeFromDB(
      userId as string
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Temporary Employee data retrieval successfully",
      data: result,
    });
  }
);

const getAllEmployees = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, employeeFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await EmployeeService.getAllEmployeesFromDB(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Employees retrieval successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getEmployeeById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await EmployeeService.getEmployeeByIdFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Employee retrieval successfully",
    data: result,
  });
});

export const EmployeeController = {
  addEmployee,
  addTemporaryEmployee,
  getTemporaryEmployee,
  getAllEmployees,
  getEmployeeById,
};
