const express = require("express");
const router = express.Router();
const { signup, login, logout, resendVerification, getMe, completeProfile } = require("../controllers/auth.controller");
const verifyToken = require("../middlewares/verifyToken");

// Public routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/resend-verification", resendVerification);

// Protected routes
router.post("/logout", verifyToken, logout);
router.get("/me", verifyToken, getMe);
router.post("/complete-profile", verifyToken, completeProfile);

module.exports = router;