const express = require("express");
const router = express.Router();
const { analyzeSymptoms, analyzeReport } = require("../controllers/ai.controller");
const verifyToken = require("../middlewares/verifyToken");
const checkRole = require("../middlewares/checkRole");

router.post("/symptom-check", verifyToken, checkRole("PATIENT"), analyzeSymptoms);
router.post("/analyze-report", verifyToken, checkRole("PATIENT"), analyzeReport);

module.exports = router;