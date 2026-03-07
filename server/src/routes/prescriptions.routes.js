const express = require("express");
const router = express.Router();
const {
  createPrescription,
  getPrescriptionById,
  getPatientPrescriptions,
  getMyPrescriptions,
} = require("../controllers/prescriptions.controller");
const verifyToken = require("../middlewares/verifyToken");
const checkRole = require("../middlewares/checkRole");

// ── Patient routes ────────────────────────────────
router.get("/my", verifyToken, checkRole("PATIENT"), getMyPrescriptions);

// ── Doctor routes ─────────────────────────────────
router.post("/", verifyToken, checkRole("DOCTOR"), createPrescription);
router.get("/patient/:patientId", verifyToken, checkRole("DOCTOR"), getPatientPrescriptions);

// ── Shared routes ─────────────────────────────────
router.get("/:id", verifyToken, checkRole("DOCTOR", "PATIENT"), getPrescriptionById);

module.exports = router;