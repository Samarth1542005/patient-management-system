const express = require("express");
const router = express.Router();
const {
  bookAppointment,
  getMyAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  cancelAppointment,
} = require("../controllers/appointments.controller");
const verifyToken = require("../middlewares/verifyToken");
const checkRole = require("../middlewares/checkRole");

// ── Patient routes ────────────────────────────────
router.post("/", verifyToken, checkRole("PATIENT"), bookAppointment);
router.get("/my", verifyToken, checkRole("PATIENT"), getMyAppointments);
router.patch("/:id/cancel", verifyToken, checkRole("PATIENT"), cancelAppointment);

// ── Doctor routes ─────────────────────────────────
router.get("/", verifyToken, checkRole("DOCTOR"), getDoctorAppointments);
router.patch("/:id/status", verifyToken, checkRole("DOCTOR"), updateAppointmentStatus);

module.exports = router;