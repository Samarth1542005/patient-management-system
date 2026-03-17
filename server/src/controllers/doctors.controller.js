const { PrismaClient } = require("@prisma/client");
const { sendSuccess, sendError } = require("../utils/response");

const prisma = new PrismaClient();

// ── GET OWN PROFILE (Doctor) ──────────────────────
const getMyProfile = async (req, res) => {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { userId: req.user.id },
      include: {
        _count: {
          select: {
            appointments: true,
            prescriptions: true,
          },
        },
      },
    });

    if (!doctor) return sendError(res, 404, "Doctor profile not found.");

    return sendSuccess(res, 200, "Profile fetched successfully.", doctor);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Something went wrong.");
  }
};

// ── UPDATE OWN PROFILE (Doctor) ───────────────────
const updateMyProfile = async (req, res) => {
  try {
    const { name, specialization, qualification, experience, phone } = req.body;

    const doctor = await prisma.doctor.update({
      where: { userId: req.user.id },
      data: { name, specialization, qualification, experience, phone },
    });

    return sendSuccess(res, 200, "Profile updated successfully.", doctor);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Something went wrong.");
  }
};

// ── GET ALL DOCTORS ───────────────────────────────
const getAllDoctors = async (req, res) => {
  try {
    const { search } = req.query;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { specialization: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const doctors = await prisma.doctor.findMany({
      where,
      select: {
        id: true,
        name: true,
        specialization: true,
        qualification: true,
        experience: true,
        phone: true,
        avatarUrl: true,
        isVerified: true,
      },
    });

    return sendSuccess(res, 200, "Doctors fetched successfully.", doctors);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Something went wrong.");
  }
};

// ── GET DOCTOR STATS (Doctor only) ────────────────
const getDoctorStats = async (req, res) => {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { userId: req.user.id },
    });

    if (!doctor) return sendError(res, 404, "Doctor profile not found.");

    const [
      totalPatients,
      pendingAppointments,
      confirmedAppointments,
      completedAppointments,
      totalPrescriptions,
    ] = await Promise.all([
      prisma.appointment.groupBy({
        by: ["patientId"],
        where: { doctorId: doctor.id },
        _count: true,
      }),
      prisma.appointment.count({
        where: { doctorId: doctor.id, status: "PENDING" },
      }),
      prisma.appointment.count({
        where: { doctorId: doctor.id, status: "CONFIRMED" },
      }),
      prisma.appointment.count({
        where: { doctorId: doctor.id, status: "COMPLETED" },
      }),
      prisma.prescription.count({
        where: { doctorId: doctor.id },
      }),
    ]);

    return sendSuccess(res, 200, "Stats fetched successfully.", {
      totalPatients: totalPatients.length,
      pendingAppointments,
      confirmedAppointments,
      completedAppointments,
      totalPrescriptions,
    });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Something went wrong.");
  }
};

// ── VERIFY NMC NUMBER (Doctor only) ───────────────
const verifyNMC = async (req, res) => {
  try {
    const { nmcNumber } = req.body;

    if (!nmcNumber) return sendError(res, 400, "NMC number is required.");

    // Check if already verified
    const doctor = await prisma.doctor.findUnique({
      where: { userId: req.user.id },
    });

    if (!doctor) return sendError(res, 404, "Doctor profile not found.");

    if (doctor.isVerified) {
      return sendError(res, 400, "Your account is already verified.");
    }

    // Check if NMC number is already used by another doctor
    const alreadyUsed = await prisma.doctor.findUnique({
      where: { nmcNumber },
    });

    if (alreadyUsed) {
      return sendError(res, 400, "This NMC number is already registered.");
    }

    // Check against NMC registry
    const registryEntry = await prisma.nMCRegistry.findUnique({
      where: { nmcNumber },
    });

    if (!registryEntry) {
      return sendError(res, 404, "NMC number not found in registry. Please check and try again.");
    }

    // Mark doctor as verified
    const updatedDoctor = await prisma.doctor.update({
      where: { userId: req.user.id },
      data: {
        nmcNumber,
        isVerified: true,
      },
    });

    return sendSuccess(res, 200, "NMC verification successful! Your profile is now verified.", updatedDoctor);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Something went wrong.");
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  getAllDoctors,
  getDoctorStats,
  verifyNMC,
};