/*
  Warnings:

  - A unique constraint covering the columns `[employeeId]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `employeeId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED');

-- CreateEnum
CREATE TYPE "EmployeeType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT');

-- CreateEnum
CREATE TYPE "BenefitsEnrollment" AS ENUM ('NONE', 'HEALTH_INSURANCE', 'PENSION');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "employeeId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "FirstName" TEXT NOT NULL,
    "MiddleName" TEXT,
    "LastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "homeAddress" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "maritalStatus" "MaritalStatus",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_information" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "residentialAddress" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_information_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emergency_contact" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emergency_contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "identification_documents" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "passportOrNationalId" TEXT NOT NULL,
    "insuranceNumber" TEXT NOT NULL,
    "socialSecurityNumber" TEXT NOT NULL,
    "visaExpiryDate" TIMESTAMP(3) NOT NULL,
    "taxIdNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "identification_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employment_details" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "employeeIdNumber" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "dateOfJoining" TIMESTAMP(3) NOT NULL,
    "employmentType" "EmployeeType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employment_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_information" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "accountHolder" TEXT NOT NULL,
    "bankAddress" TEXT NOT NULL,
    "sortCode" TEXT NOT NULL,
    "ibanOrSwfit" TEXT NOT NULL,
    "benefitEnrollment" "BenefitsEnrollment" NOT NULL DEFAULT 'NONE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "financial_information_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "additional_documents" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "signedContractPaperwork" TEXT NOT NULL,
    "educationalCertificates" TEXT[],
    "professionalCertificates" TEXT,
    "recentPhotograph" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "additional_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contact_information_employeeId_key" ON "contact_information"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "contact_information_phoneNumber_key" ON "contact_information"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "contact_information_email_key" ON "contact_information"("email");

-- CreateIndex
CREATE UNIQUE INDEX "emergency_contact_employeeId_key" ON "emergency_contact"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "identification_documents_employeeId_key" ON "identification_documents"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "employment_details_employeeId_key" ON "employment_details"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "employment_details_employeeIdNumber_key" ON "employment_details"("employeeIdNumber");

-- CreateIndex
CREATE UNIQUE INDEX "financial_information_employeeId_key" ON "financial_information"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "users_employeeId_key" ON "users"("employeeId");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_information" ADD CONSTRAINT "contact_information_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emergency_contact" ADD CONSTRAINT "emergency_contact_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "identification_documents" ADD CONSTRAINT "identification_documents_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employment_details" ADD CONSTRAINT "employment_details_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "financial_information" ADD CONSTRAINT "financial_information_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "additional_documents" ADD CONSTRAINT "additional_documents_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
