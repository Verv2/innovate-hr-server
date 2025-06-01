/*
  Warnings:

  - The `professionalCertificates` column on the `additional_documents` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "additional_documents" DROP COLUMN "professionalCertificates",
ADD COLUMN     "professionalCertificates" TEXT[];
