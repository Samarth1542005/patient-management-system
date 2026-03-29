-- AlterEnum
ALTER TYPE "AppointmentStatus" ADD VALUE 'RESCHEDULED';

-- CreateTable
CREATE TABLE "SlotSuggestion" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "suggestedSlots" TEXT[],
    "doctorMessage" TEXT,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SlotSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SlotSuggestion_appointmentId_key" ON "SlotSuggestion"("appointmentId");

-- AddForeignKey
ALTER TABLE "SlotSuggestion" ADD CONSTRAINT "SlotSuggestion_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
