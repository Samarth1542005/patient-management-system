const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const verifyToken = require("../middlewares/verifyToken");
const { sendSlotSuggestionEmail } = require("../services/emailService");
const { sendSlotSuggestionSMS } = require("../services/smsService");

const prisma = new PrismaClient();

// POST /api/appointments/:id/suggest-slots
router.post("/:id/suggest-slots", verifyToken, async (req, res) => {
  const { id } = req.params;
  const { suggestedSlots, doctorMessage } = req.body;

  if (!suggestedSlots || !Array.isArray(suggestedSlots) || suggestedSlots.length === 0) {
    return res.status(400).json({ error: "Please provide at least one suggested slot." });
  }

  try {
    // Fetch appointment with patient + doctor info
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: {
          include: { user: true },
        },
        doctor: {
          include: { user: true },
        },
      },
    });

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found." });
    }

    // Only the doctor of this appointment can suggest slots
    if (appointment.doctor.userId !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized." });
    }

    if (appointment.status !== "PENDING") {
      return res.status(400).json({ error: "Only PENDING appointments can be declined." });
    }

    // Update appointment status + create SlotSuggestion in a transaction
    const [updatedAppointment, slotSuggestion] = await prisma.$transaction([
      prisma.appointment.update({
        where: { id },
        data: { status: "RESCHEDULED" },
      }),
      prisma.slotSuggestion.create({
        data: {
          appointmentId: id,
          suggestedSlots,
          doctorMessage: doctorMessage || null,
        },
      }),
    ]);

    const patientName = appointment.patient.name;
    const doctorName = appointment.doctor.name;
    const patientEmail = appointment.patient.user.email;
    const patientPhone = appointment.patient.phone;

    // Send Email
    try {
      await sendSlotSuggestionEmail({
        toEmail: patientEmail,
        patientName,
        doctorName,
        suggestedSlots,
        doctorMessage,
      });
    } catch (emailErr) {
      console.error("Email send failed:", emailErr.message);
    }

    // Send SMS (if phone available)
    if (patientPhone) {
      try {
        await sendSlotSuggestionSMS({
          toPhone: patientPhone,
          patientName,
          doctorName,
          suggestedSlots,
        });
      } catch (smsErr) {
        console.error("SMS send failed:", smsErr.message);
      }
    }

    res.json({
      message: "Appointment declined and suggested slots sent to patient.",
      appointment: updatedAppointment,
      slotSuggestion,
    });
  } catch (err) {
    console.error("suggest-slots error:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;