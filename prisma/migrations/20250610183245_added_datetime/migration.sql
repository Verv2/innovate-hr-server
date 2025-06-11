/*
  Warnings:

  - The `leaveDates` column on the `leave_requests` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "leave_requests" DROP COLUMN "leaveDates",
ADD COLUMN     "leaveDates" TIMESTAMP(3)[];
