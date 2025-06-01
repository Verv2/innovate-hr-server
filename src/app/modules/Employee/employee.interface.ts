import {
  BenefitsEnrollment,
  EmployeeType,
  Gender,
  MaritalStatus,
} from "@prisma/client";

export type TEmployee = {
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: Date;
  gender: Gender;
  homeAddress: string;
  nationality: string;
  maritalStatus?: MaritalStatus;
};

export type TContactInformation = {
  phoneNumber: string;
  email: string;
  residentialAddress: string;
};

export type TEmergencyContact = {
  name: string;
  relationship: string;
  emergencyPhoneNumber: string;
};

export type TCombinedContact = TContactInformation & TEmergencyContact;

export type TIdentificationDocuments = {
  passportOrNationalId: string;
  insuranceNumber: string;
  socialSecurityNumber: string;
  visaExpiryDate: Date;
  taxIdNumber?: string;
};

export type TEmployeeDetails = {
  employeeIdNumber: string;
  jobTitle: string;
  department: string;
  dateOfJoining: Date;
  employmentType: EmployeeType;
};

export type TFinancialInformation = {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  bankAddress: string;
  sortCode: string;
  ibanOrSwfit: string;
  benefitEnrollment: BenefitsEnrollment;
};

export type TAdditionalDocuments = {
  signedContractPaperwork: string;
  educationalCertificates: string[];
  professionalCertificates?: string[];
  recentPhotograph?: string;
};

export type TemporaryEmployeeData = {
  passportOrNationalIdUrl?: string;
  signedContractPaperworkUrl?: string;
  recentPhotographUrl?: string;
  educationalCertificatesUrl?: string[];
  professionalCertificatesUrl?: string[];
  [key: string]: any;
};

export type TFullEmployeeData = {
  step: number;
  basicInfo: TEmployee;
  contactInformation: TCombinedContact;
  employeeDetails: TEmployeeDetails;
  financialInformation: TFinancialInformation;
  identificationDocuments: Omit<
    TIdentificationDocuments,
    "passportOrNationalId"
  >;
  recentPhotographUrl?: string;
  passportOrNationalIdUrl: string;
  educationalCertificatesUrl: string[];
  signedContractPaperworkUrl: string;
  professionalCertificatesUrl?: string[];
};
