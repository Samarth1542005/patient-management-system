const { PrismaClient } = require("@prisma/client");
const { sendSuccess, sendError } = require("../utils/response");

const prisma = new PrismaClient();

// ── CREATE PRESCRIPTION (Doctor only) ─────────────
const createPrescription = async (req, res) => {
  try {
    const { appointmentId, diagnosis, notes, medicines } = req.body;

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) return sendError(res, 404, "Appointment not found.");

    if (appointment.status !== "CONFIRMED")
      return sendError(res, 400, "Prescription can only be created for confirmed appointments.");

    const prescription = await prisma.prescription.create({
      data: {
        appointmentId,
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        diagnosis,
        notes,
        medicines: {
          create: medicines.map((m) => ({
            name: m.name,
            dosage: m.dosage,
            frequency: m.frequency,
            duration: m.duration,
            instructions: m.instructions || null,
          })),
        },
      },
      include: { medicines: true, patient: true, doctor: true },
    });

    // Mark appointment as completed
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: "COMPLETED" },
    });

    return sendSuccess(res, 201, "Prescription created successfully.", prescription);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Something went wrong.");
  }
};

// ── GET PRESCRIPTION BY ID ─────────────────────────
const getPrescriptionById = async (req, res) => {
  try {
    const prescription = await prisma.prescription.findUnique({
      where: { id: req.params.id },
      include: { medicines: true, patient: true, doctor: true },
    });

    if (!prescription) return sendError(res, 404, "Prescription not found.");

    return sendSuccess(res, 200, "Prescription fetched successfully.", prescription);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Something went wrong.");
  }
};

// ── GET ALL PRESCRIPTIONS FOR A PATIENT ───────────
const getPatientPrescriptions = async (req, res) => {
  try {
    const prescriptions = await prisma.prescription.findMany({
      where: { patientId: req.params.patientId },
      orderBy: { createdAt: "desc" },
      include: { medicines: true, doctor: true },
    });

    return sendSuccess(res, 200, "Prescriptions fetched successfully.", prescriptions);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Something went wrong.");
  }
};

// ── GET MY PRESCRIPTIONS (Patient only) ───────────
const getMyPrescriptions = async (req, res) => {
  try {
    const patient = await prisma.patient.findUnique({
      where: { userId: req.user.id },
    });

    if (!patient) return sendError(res, 404, "Patient profile not found.");

    const prescriptions = await prisma.prescription.findMany({
      where: { patientId: patient.id },
      orderBy: { createdAt: "desc" },
      include: { medicines: true, doctor: true },
    });

    return sendSuccess(res, 200, "Prescriptions fetched successfully.", prescriptions);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Something went wrong.");
  }
};

module.exports = {
  createPrescription,
  getPrescriptionById,
  getPatientPrescriptions,
  getMyPrescriptions,
};