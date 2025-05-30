import { Gender, MaritalStatus } from "@prisma/client";

export type TEmployee = {
  FirstName: string;
  MiddleName?: string;
  LastName: string;
  dateOfBirth: Date;
  gender: Gender;
  homeAddress: string;
  nationality: string;
  maritalStatus?: MaritalStatus;
};

export type TemporaryEmployeeData = {
  passportOrNationalIdUrl?: string;
  signedContractPaperworkUrl?: string;
  recentPhotographUrl?: string;
  educationalCertificatesUrl?: string[];
  professionalCertificatesUrl?: string[];
  [key: string]: any;
};
