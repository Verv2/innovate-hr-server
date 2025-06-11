/*
  Warnings:

  - You are about to drop the column `userId` on the `leave_requests` table. All the data in the column will be lost.
  - Added the required column `employeeId` to the `leave_requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "LeaveStatus" ADD VALUE 'CANCELLED';

-- DropForeignKey
ALTER TABLE "leave_requests" DROP CONSTRAINT "leave_requests_userId_fkey";

-- AlterTable
ALTER TABLE "leave_requests" DROP COLUMN "userId",
ADD COLUMN     "employeeId" TEXT NOT NULL,
ADD COLUMN     "isOngoing" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "employee_leaves" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "totalLeaveDays" INTEGER NOT NULL DEFAULT 15,
    "availableLeaveDays" INTEGER NOT NULL DEFAULT 15,
    "unpaidLeaveDays" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "employee_leaves_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "employee_leaves_employeeId_key" ON "employee_leaves"("employeeId");

-- AddForeignKey
ALTER TABLE "employee_leaves" ADD CONSTRAINT "employee_leaves_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
