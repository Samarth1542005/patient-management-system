const express = require("express");
const router = express.Router();
const {
  getMyProfile,
  updateMyProfile,
  getPatientById,
  getAllPatients,
  getPatientHistory,
  addMedicalHistory,
  addVitalSigns,
} = require("../controllers/patients.controller");
const verifyToken = require("../middlewares/verifyToken");
const checkRole = require("../middlewares/checkRole");

// ── Patient routes ────────────────────────────────
router.get("/me", verifyToken, checkRole("PATIENT"), getMyProfile);
router.patch("/me", verifyToken, checkRole("PATIENT"), updateMyProfile);

// ── Doctor only routes ────────────────────────────
router.get("/", verifyToken, checkRole("DOCTOR"), getAllPatients);
router.get("/:id", verifyToken, checkRole("DOCTOR"), getPatientById);
router.get("/:id/history", verifyToken, checkRole("DOCTOR", "PATIENT"), getPatientHistory);
router.post("/:id/medical-history", verifyToken, checkRole("DOCTOR"), addMedicalHistory);
router.post("/:id/vitals", verifyToken, checkRole("DOCTOR"), addVitalSigns);

module.exports = router;