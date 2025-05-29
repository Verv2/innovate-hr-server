/*
  Warnings:

  - You are about to drop the column `FirstName` on the `employees` table. All the data in the column will be lost.
  - You are about to drop the column `LastName` on the `employees` table. All the data in the column will be lost.
  - You are about to drop the column `MiddleName` on the `employees` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `employees` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "employees" DROP COLUMN "FirstName",
DROP COLUMN "LastName",
DROP COLUMN "MiddleName",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "middleName" TEXT;
