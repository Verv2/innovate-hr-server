/*
  Warnings:

  - Added the required column `step` to the `temporary_employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "temporary_employee" ADD COLUMN     "step" INTEGER NOT NULL;
