import { Request } from "express";
import prisma from "../../../shared/prisma";
import {
  TAdditionalDocuments,
  TCombinedContact,
  TContactInformation,
  TEmergencyContact,
  TEmployee,
  TEmployeeDetails,
  TemporaryEmployeeData,
  TFinancialInformation,
  TFullEmployeeData,
  TIdentificationDocuments,
  TShift,
} from "./employee.interface";
import { IUploadFile } from "../../interfaces/file";
import ApiError from "../../errors/ApiErrors";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../../helpers/paginationHelper";
import { Employees, Prisma } from "@prisma/client";
import { employeeSearchableFields } from "./employee.constant";
import { TUser } from "../User/user.interface";

const addEmployeeIntoDB = async (
  req: Request & { user?: { userId: string } }
) => {
  const userId = req.user?.userId as string;
  const existingTemporary = await prisma.temporaryEmployee.findUnique({
    where: { userId },
  });

  if (!existingTemporary) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "No temporary employee data found"
    );
  }

  const fullData = existingTemporary.data as unknown as TFullEmployeeData;

  const basicInfo: TEmployee = fullData.basicInfo;
  const combineContactInformation: TCombinedContact =
    fullData.contactInformation;

  const contactInformation: TContactInformation = {
    phoneNumber: combineContactInformation.phoneNumber,
    email: combineContactInformation.email,
    residentialAddress: combineContactInformation.residentialAddress,
  };

  const emergencyContact: TEmergencyContact = {
    name: combineContactInformation.name,
    relationship: combineContactInformation.relationship,
    emergencyPhoneNumber: combineContactInformation.emergencyPhoneNumber,
  };

  const identificationDocuments: TIdentificationDocuments = {
    ...fullData.identificationDocuments,
    passportOrNationalId: fullData.passportOrNationalIdUrl,
  };

  const employeeDetails: TEmployeeDetails = fullData.employeeDetails;
  const financialInformation: TFinancialInformation =
    fullData.financialInformation;

  const additionalDocuments: TAdditionalDocuments = {
    signedContractPaperwork: fullData.signedContractPaperworkUrl,
    educationalCertificates: fullData.educationalCertificatesUrl,
    professionalCertificates: fullData?.professionalCertificatesUrl ?? [],
    recentPhotograph: fullData?.recentPhotographUrl,
  };

  const result = await prisma.$transaction(async (tx) => {
    const existingUser = await prisma.user.findUnique({
      where: { email: contactInformation.email },
    });

    if (existingUser) {
      throw new ApiError(httpStatus.CONFLICT, "User already exists");
    }

    const user = await tx.user.create({
      data: { email: contactInformation.email, status: "IN_PROGRESS" },
    });

    const employee = await tx.employees.create({
      data: { ...basicInfo, userId: user.id },
    });

    await tx.contactInformation.create({
      data: { ...contactInformation, employeeId: employee.id },
    });

    await tx.emergencyContact.create({
      data: { ...emergencyContact, employeeId: employee.id },
    });

    await tx.identificationDocuments.create({
      data: { ...identificationDocuments, employeeId: employee.id },
    });

    await tx.employmentDetails.create({
      data: { ...employeeDetails, employeeId: employee.id },
    });

    await tx.financialInformation.create({
      data: { ...financialInformation, employeeId: employee.id },
    });

    await tx.additionalDocuments.create({
      data: { ...additionalDocuments, employeeId: employee.id },
    });

    await tx.shift.create({
      data: {
        employeeId: employee.id,
        shiftStart: "09:00AM",
        shiftEnd: "05:00PM",
      },
    });

    await tx.employeeLeaves.create({
      data: {
        employeeId: employee.id,
      },
    });

    return employee;
  });

  await prisma.temporaryEmployee.delete({
    where: {
      userId: userId,
    },
  });

  return result;
};

const addTemporaryEmployeeIntoDB = async (
  req: Request & { user?: { userId: string } }
) => {
  const userId = req.user?.userId as string;

  const existingTemporary = await prisma.temporaryEmployee.findUnique({
    where: { userId },
  });

  console.log("userId", userId);

  const {
    passportOrNationalId,
    signedContractPaperwork,
    recentPhotograph,
    educationalCertificates,
    professionalCertificates,
  } = req.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  const passportOrNationalIdFile = passportOrNationalId?.[0] as IUploadFile;
  const signedContractPaperworkFile =
    signedContractPaperwork?.[0] as IUploadFile;
  const recentPhotographFile = recentPhotograph?.[0] as IUploadFile;

  let arrEducationalCertificates: string[] = [];
  if (educationalCertificates) {
    arrEducationalCertificates = educationalCertificates.map(
      (certificate) => certificate.path
    );
  }

  let arrProfessionalCertificates: string[] = [];
  if (professionalCertificates) {
    arrProfessionalCertificates = professionalCertificates.map(
      (certificate) => certificate.path
    );
  }

  const data = req.body;

  const existingData = (
    typeof existingTemporary?.data === "object" &&
    existingTemporary?.data !== null
      ? (existingTemporary.data as TemporaryEmployeeData)
      : {}
  ) as TemporaryEmployeeData;

  const mergedData = {
    ...existingData,
    ...data,
    passportOrNationalIdUrl:
      passportOrNationalIdFile?.path ?? existingData.passportOrNationalIdUrl,
    signedContractPaperworkUrl:
      signedContractPaperworkFile?.path ??
      existingData.signedContractPaperworkUrl,
    recentPhotographUrl:
      recentPhotographFile?.path ?? existingData.recentPhotographUrl,
    educationalCertificatesUrl:
      arrEducationalCertificates.length > 0
        ? arrEducationalCertificates
        : existingData.educationalCertificatesUrl ?? [],
    professionalCertificatesUrl:
      arrProfessionalCertificates.length > 0
        ? arrProfessionalCertificates
        : existingData.professionalCertificatesUrl ?? [],
  };

  const result = await prisma.temporaryEmployee.upsert({
    where: { userId },
    update: {
      data: mergedData,
      step: data.step,
    },
    create: {
      userId,
      data: mergedData,
      step: data.step,
    },
  });

  console.log("result", result);

  return result;
};

const updateShiftIntoDB = async (payload: TShift) => {
  const existingEmployee = await prisma.employees.findUnique({
    where: { id: payload.employeeId },
  });

  if (!existingEmployee) {
    throw new ApiError(httpStatus.CONFLICT, "Employee doesn't exists!!");
  }

  const shiftData = {
    shiftStart: payload.shiftStart,
    shiftEnd: payload.shiftEnd,
  };
  const result = await prisma.shift.update({
    where: { employeeId: payload.employeeId },
    data: shiftData,
  });

  return result;
};

const requestForLeave = async (req: Request & { user?: TUser }) => {
  if (!req.user) {
    throw new Error("User information is missing.");
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: req.user.email },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist");
  }

  const existingEmployee = await prisma.employees.findUnique({
    where: { userId: existingUser.id },
  });

  if (!existingEmployee) {
    throw new ApiError(httpStatus.NOT_FOUND, "Employee doesn't exist");
  }

  const requestData = {
    employeeId: existingEmployee.id,
    ...req.body,
  };

  const result = await prisma.leaveRequest.create({
    data: requestData,
  });

  console.log("From service request for a leave", result);
  return result;
};

// get

const getTemporaryEmployeeFromDB = async (userId: string) => {
  const result = await prisma.temporaryEmployee.findUnique({
    where: { userId },
  });

  return result;
};

const getAllEmployeesFromDB = async (
  filters: any,
  options: IPaginationOptions
) => {
  const { limit, page, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions: Prisma.EmployeesWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: employeeSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        return {
          [key]: {
            equals: (filterData as any)[key],
          },
        };
      }),
    });
  }
  andConditions.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.EmployeesWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.employees.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },
    include: {
      contactInformation: true,
      emergencyContact: true,
      identificationDocuments: true,
      employmentDetails: true,
      financialInformation: true,
      additionalDocuments: true,
      shift: true,
      employeeLeaves: true,
      leaveRequest: true,
      // user: true,
    },
  });

  const total = await prisma.employees.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getEmployeeByIdFromDB = async (id: string): Promise<Employees | null> => {
  const result = await prisma.employees.findUnique({
    where: {
      id,
    },
    include: {
      contactInformation: true,
      emergencyContact: true,
      identificationDocuments: true,
      employmentDetails: true,
      financialInformation: true,
      additionalDocuments: true,
      // user: true,
    },
  });
  return result;
};

export const EmployeeService = {
  addEmployeeIntoDB,
  addTemporaryEmployeeIntoDB,
  updateShiftIntoDB,
  requestForLeave,
  getTemporaryEmployeeFromDB,
  getAllEmployeesFromDB,
  getEmployeeByIdFromDB,
};
