/*
  Warnings:

  - You are about to drop the column `phoneNumber` on the `emergency_contact` table. All the data in the column will be lost.
  - Added the required column `emergencyPhoneNumber` to the `emergency_contact` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "emergency_contact" DROP COLUMN "phoneNumber",
ADD COLUMN     "emergencyPhoneNumber" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "temporary_employee" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "step" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "temporary_employee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "temporary_employee_userId_key" ON "temporary_employee"("userId");
