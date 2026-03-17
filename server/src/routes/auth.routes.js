const express = require("express");
const router = express.Router();
const { signup, login, logout, resendVerification } = require("../controllers/auth.controller");
const verifyToken = require("../middlewares/verifyToken");

// Public routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/resend-verification", resendVerification);

// Protected route
router.post("/logout", verifyToken, logout);

module.exports = router;