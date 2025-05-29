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

  const mergedData = {
    ...(typeof existingTemporary?.data === "object" &&
    existingTemporary?.data !== null
      ? existingTemporary.data
      : {}),
    ...data,
    passportOrNationalIdUrl: passportOrNationalIdFile?.path,
    signedContractPaperworkUrl: signedContractPaperworkFile?.path,
    recentPhotographUrl: recentPhotographFile?.path,
    educationalCertificatesUrl: arrEducationalCertificates,
    professionalCertificatesUrl: arrProfessionalCertificates,
  };

  // console.log("mergedData", mergedData);

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

export const EmployeeService = {
  addEmployeeIntoDB,
  addTemporaryEmployeeIntoDB,
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
