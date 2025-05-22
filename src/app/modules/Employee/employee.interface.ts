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
