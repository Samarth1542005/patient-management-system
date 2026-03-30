const { PrismaClient } = require("@prisma/client");
const { sendSuccess, sendError } = require("../utils/response");

const prisma = new PrismaClient();

// ── GET OWN PROFILE ───────────────────────────────
const getMyProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { patient: true },
    });

    if (!user?.patient) return sendError(res, 404, "Patient profile not found.");

    return sendSuccess(res, 200, "Profile fetched successfully.", user);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Something went wrong.");
  }
};

// ── UPDATE OWN PROFILE ────────────────────────────

const updateMyProfile = async (req, res) => {
  try {
    const { email, phone, address, bloodGroup, emergencyContact } = req.body;

    // Check if email is taken by another user
    if (email) {
      const existing = await prisma.user.findFirst({
        where: { email, NOT: { id: req.user.id } },
      });
      if (existing) return sendError(res, 409, "This email is already in use.");
    }

    const updatedUser = await prisma.$transaction(async (tx) => {
      if (email) {
        await tx.user.update({
          where: { id: req.user.id },
          data: { email },
        });
      }

      await tx.patient.update({
        where: { userId: req.user.id },
        data: {
          ...(phone !== undefined && { phone }),
          ...(address !== undefined && { address }),
          ...(bloodGroup !== undefined && { bloodGroup: bloodGroup || null }),
          ...(emergencyContact !== undefined && { emergencyContact }),
        },
      });

      return tx.user.findUnique({
        where: { id: req.user.id },
        include: { patient: true },
      });
    });

    return sendSuccess(res, 200, "Profile updated successfully.", updatedUser);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Something went wrong.");
  }
};

// ── GET PATIENT BY ID (Doctor only) ───────────────
const getPatientById = async (req, res) => {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: req.params.id },
    });

    if (!patient) return sendError(res, 404, "Patient not found.");

    return sendSuccess(res, 200, "Patient fetched successfully.", patient);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Something went wrong.");
  }
};

// ── GET ALL PATIENTS (Doctor only) ────────────────
const getAllPatients = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { phone: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        skip: Number(skip),
        take: Number(limit),
        orderBy: { createdAt: "desc" },
      }),
      prisma.patient.count({ where }),
    ]);

    return sendSuccess(res, 200, "Patients fetched successfully.", {
      patients,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Something went wrong.");
  }
};

// ── GET FULL PATIENT HISTORY (Doctor + Patient) ───
const getPatientHistory = async (req, res) => {
  try {
    const patientId = req.params.id;

    const [patient, appointments, prescriptions, medicalHistory, vitalSigns] =
      await Promise.all([
        prisma.patient.findUnique({ where: { id: patientId } }),
        prisma.appointment.findMany({
          where: { patientId },
          orderBy: { date: "desc" },
          include: { doctor: true },
        }),
        prisma.prescription.findMany({
          where: { patientId },
          orderBy: { createdAt: "desc" },
          include: { medicines: true, doctor: true },
        }),
        prisma.medicalHistory.findMany({
          where: { patientId },
          orderBy: { diagnosedAt: "desc" },
        }),
        prisma.vitalSign.findMany({
          where: { patientId },
          orderBy: { recordedAt: "desc" },
          take: 10,
        }),
      ]);

    if (!patient) return sendError(res, 404, "Patient not found.");

    return sendSuccess(res, 200, "Patient history fetched successfully.", {
      patient,
      appointments,
      prescriptions,
      medicalHistory,
      vitalSigns,
    });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Something went wrong.");
  }
};

// ── ADD MEDICAL HISTORY (Doctor only) ─────────────
const addMedicalHistory = async (req, res) => {
  try {
    const { condition, severity, diagnosedAt, resolvedAt, notes } = req.body;

    const record = await prisma.medicalHistory.create({
      data: {
        patientId: req.params.id,
        condition,
        severity,
        diagnosedAt: new Date(diagnosedAt),
        resolvedAt: resolvedAt ? new Date(resolvedAt) : null,
        notes,
      },
    });

    return sendSuccess(res, 201, "Medical history added successfully.", record);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Something went wrong.");
  }
};

// ── ADD VITAL SIGNS (Doctor only) ─────────────────
const addVitalSigns = async (req, res) => {
  try {
    const { bloodPressure, heartRate, temperature, weight, height, oxygenSat } =
      req.body;

    const vitals = await prisma.vitalSign.create({
      data: {
        patientId: req.params.id,
        bloodPressure,
        heartRate,
        temperature,
        weight,
        height,
        oxygenSat,
      },
    });

    return sendSuccess(res, 201, "Vital signs recorded successfully.", vitals);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Something went wrong.");
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  getPatientById,
  getAllPatients,
  getPatientHistory,
  addMedicalHistory,
  addVitalSigns,
};