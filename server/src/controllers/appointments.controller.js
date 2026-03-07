const { PrismaClient } = require("@prisma/client");
const { sendSuccess, sendError } = require("../utils/response");

const prisma = new PrismaClient();

// ── BOOK APPOINTMENT (Patient only) ───────────────
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, reason } = req.body;

    const patient = await prisma.patient.findUnique({
      where: { userId: req.user.id },
    });

    if (!patient) return sendError(res, 404, "Patient profile not found.");

    const appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId,
        date: new Date(date),
        reason,
      },
      include: {
        doctor: true,
        patient: true,
      },
    });

    return sendSuccess(res, 201, "Appointment booked successfully.", appointment);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Something went wrong.");
  }
};

// ── GET MY APPOINTMENTS (Patient) ─────────────────
const getMyAppointments = async (req, res) => {
  try {
    const patient = await prisma.patient.findUnique({
      where: { userId: req.user.id },
    });

    if (!patient) return sendError(res, 404, "Patient profile not found.");

    const appointments = await prisma.appointment.findMany({
      where: { patientId: patient.id },
      orderBy: { date: "desc" },
      include: { doctor: true },
    });

    return sendSuccess(res, 200, "Appointments fetched successfully.", appointments);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Something went wrong.");
  }
};

// ── GET DOCTOR'S APPOINTMENTS (Doctor only) ────────
const getDoctorAppointments = async (req, res) => {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { userId: req.user.id },
    });

    if (!doctor) return sendError(res, 404, "Doctor profile not found.");

    const { status } = req.query;

    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: doctor.id,
        ...(status && { status }),
      },
      orderBy: { date: "desc" },
      include: { patient: true },
    });

    return sendSuccess(res, 200, "Appointments fetched successfully.", appointments);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Something went wrong.");
  }
};

// ── UPDATE APPOINTMENT STATUS (Doctor only) ────────
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const appointment = await prisma.appointment.update({
      where: { id: req.params.id },
      data: { status, notes },
      include: { patient: true, doctor: true },
    });

    return sendSuccess(res, 200, "Appointment updated successfully.", appointment);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Something went wrong.");
  }
};

// ── CANCEL APPOINTMENT (Patient only) ─────────────
const cancelAppointment = async (req, res) => {
  try {
    const patient = await prisma.patient.findUnique({
      where: { userId: req.user.id },
    });

    const appointment = await prisma.appointment.findUnique({
      where: { id: req.params.id },
    });

    if (!appointment) return sendError(res, 404, "Appointment not found.");

    if (appointment.patientId !== patient.id)
      return sendError(res, 403, "You can only cancel your own appointments.");

    const updated = await prisma.appointment.update({
      where: { id: req.params.id },
      data: { status: "CANCELLED" },
    });

    return sendSuccess(res, 200, "Appointment cancelled successfully.", updated);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Something went wrong.");
  }
};

module.exports = {
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment,
};