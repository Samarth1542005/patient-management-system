/*
  Warnings:

  - A unique constraint covering the columns `[nmcNumber]` on the table `Doctor` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "nmcNumber" TEXT;

-- CreateTable
CREATE TABLE "NMCRegistry" (
    "id" TEXT NOT NULL,
    "nmcNumber" TEXT NOT NULL,
    "doctorName" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "council" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NMCRegistry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NMCRegistry_nmcNumber_key" ON "NMCRegistry"("nmcNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_nmcNumber_key" ON "Doctor"("nmcNumber");
