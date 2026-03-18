const express = require("express");
const router = express.Router();
const { analyzeSymptoms } = require("../controllers/ai.controller");
const verifyToken = require("../middlewares/verifyToken");
const checkRole = require("../middlewares/checkRole");

router.post("/symptom-check", verifyToken, checkRole("PATIENT"), analyzeSymptoms);

module.exports = router;