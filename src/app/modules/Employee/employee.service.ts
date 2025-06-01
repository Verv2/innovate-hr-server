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
} from "./employee.interface";
import { IUploadFile } from "../../interfaces/file";
import ApiError from "../../errors/ApiErrors";
import httpStatus from "http-status";

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
      data: { email: contactInformation.email },
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

    return employee;
  });

  // await prisma.temporaryEmployee.delete({
  //   where: {
  //     userId: userId,
  //   },
  // });

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

const getTemporaryEmployeeFromDB = async (userId: string) => {
  const result = await prisma.temporaryEmployee.findUnique({
    where: { userId },
  });

  return result;
};

export const EmployeeService = {
  addEmployeeIntoDB,
  addTemporaryEmployeeIntoDB,
  getTemporaryEmployeeFromDB,
};

// const employee = {
//   employee: {
//     FirstName: "Ahmad",
//     MiddleName: "Ali",
//     LastName: "Khan",
//     dateOfBirth: "1990-05-15T00:00:00Z",
//     gender: "MALE",
//     homeAddress: "123 Main Street, Lahore, Pakistan",
//     nationality: "Bangladeshi",
//     maritalStatus: "SINGLE",
//   },
//   step: 1,
// };

// const contact = {
//   "step":2,
//   "contactInformation": {
//     "phoneNumber": "+1234567890",
//     "email": "john.doe@example.com",
//     "residentialAddress": "123 Main St, Springfield",
//     "name": "Jane Doe",
//     "relationship": "Spouse",
//     "emergencyPhoneNumber": "+1987654321"
//   }
// }

// const id = {
//   "step": 3,
//   "identificationDocuments": {
//   "insuranceNumber": "INS-987654321",
//   "socialSecurityNumber": "SSN-123-45-6789",
//   "visaExpiryDate": "2025-12-31T00:00:00.000Z",
//   "taxIdNumber": "TAX-556677889"
// }
// }

// const details = {
//   "step": 4,
//   "employeeDetails":{
//   "employeeIdNumber": "EMP-2025-001",
//   "jobTitle": "Software Engineer",
//   "department": "Engineering",
//   "dateOfJoining": "2025-01-15T00:00:00.000Z",
//   "employmentType": "FULL_TIME"
// }
// }

// const finance = {
//   "step": 5,
//   "financialInformation": {
//   "bankName": "First National Bank",
//   "accountNumber": "1234567890",
//   "accountHolder": "John Doe",
//   "bankAddress": "456 Bank Street, Finance City",
//   "sortCode": "00-11-22",
//   "ibanOrSwfit": "GB29NWBK60161331926819",
//   "benefitEnrollment": "HEALTH"
// }
// }

// const additional = {
//   "step": 6
// }
