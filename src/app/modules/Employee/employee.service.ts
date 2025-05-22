import { Request } from "express";
import prisma from "../../../shared/prisma";
import { TEmployee } from "./employee.interface";
import { IUploadFile } from "../../interfaces/file";

const addEmployeeIntoDB = async (req: Request) => {
  const { image, passport, nationalId, certificate } = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  const data: TEmployee = req.body.data;

  console.log("data", data);
  console.log("image", image);
  console.log("passport", passport);
  console.log("nationalId", nationalId);
  console.log("certificate", certificate);
};

export const EmployeeService = {
  addEmployeeIntoDB,
};
