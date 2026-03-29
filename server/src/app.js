const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.routes");
const patientRoutes = require("./routes/patients.routes");
const appointmentRoutes = require("./routes/appointments.routes");
const prescriptionRoutes = require("./routes/prescriptions.routes");
const doctorRoutes = require("./routes/doctors.routes");
const aiRoutes = require("./routes/ai.routes");
const slotSuggestionRoutes = require("./routes/slotSuggestion");

dotenv.config();

const app = express();

// ── Middlewares ──────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://patient-management-system-six-teal.vercel.app",
    process.env.CLIENT_URL,
  ].filter(Boolean),
  credentials: true,
}));
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// ── Health Check ─────────────────────────────────
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running" });
});

// ── Routes ────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/appointments", slotSuggestionRoutes);

// ── Global Error Handler ──────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// ── Start Server ──────────────────────────────────
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});