/*
  Warnings:

  - A unique constraint covering the columns `[employeeId]` on the table `additional_documents` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "additional_documents_employeeId_key" ON "additional_documents"("employeeId");
