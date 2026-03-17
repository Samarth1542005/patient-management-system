const express = require("express");
const router = express.Router();
const {
  getMyProfile,
  updateMyProfile,
  getAllDoctors,
  getDoctorStats,
  verifyNMC,
} = require("../controllers/doctors.controller");
const verifyToken = require("../middlewares/verifyToken");
const checkRole = require("../middlewares/checkRole");

// ── Public routes ─────────────────────────────────
router.get("/", verifyToken, getAllDoctors);

// ── Doctor only routes ────────────────────────────
router.get("/me", verifyToken, checkRole("DOCTOR"), getMyProfile);
router.patch("/me", verifyToken, checkRole("DOCTOR"), updateMyProfile);
router.get("/stats", verifyToken, checkRole("DOCTOR"), getDoctorStats);
router.post("/verify-nmc", verifyToken, checkRole("DOCTOR"), verifyNMC);

module.exports = router;