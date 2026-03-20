const { createClient } = require("@supabase/supabase-js");
const { PrismaClient } = require("@prisma/client");
const { sendSuccess, sendError } = require("../utils/response");

const prisma = new PrismaClient();
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// ── SIGNUP ────────────────────────────────────────
const signup = async (req, res) => {
  const { email, password, role, name } = req.body;

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role },
        emailRedirectTo: `${process.env.CLIENT_URL}/verify-email`,
      },
    });

    if (error) return sendError(res, 400, error.message);

    const supabaseUserId = data.user.id;

    const user = await prisma.user.create({
      data: {
        id: supabaseUserId,
        email,
        role,
      },
    });

    if (role === "DOCTOR") {
      await prisma.doctor.create({
        data: {
          userId: user.id,
          name,
          specialization: req.body.specialization || "General",
          qualification: req.body.qualification || "MBBS",
          experience: parseInt(req.body.experience) || 0,
        },
      });
    } else if (role === "PATIENT") {
      await prisma.patient.create({
        data: {
          userId: user.id,
          name,
          dob: new Date(req.body.dob) || new Date(),
          gender: req.body.gender || "OTHER",
        },
      });
    }

    return sendSuccess(res, 201, "Account created successfully. Please check your email to verify your account.");
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Something went wrong during signup.");
  }
};

// ── LOGIN ─────────────────────────────────────────
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return sendError(res, 401, error.message);

    if (!data.user.email_confirmed_at) {
      return sendError(res, 403, "Please verify your email before logging in.");
    }

    const { access_token, user } = data.session ?
      { access_token: data.session.access_token, user: data.user } :
      { access_token: null, user: null };

    if (!access_token) return sendError(res, 401, "Login failed.");

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { doctor: true, patient: true },
    });

    return sendSuccess(res, 200, "Login successful.", {
      token: access_token,
      user: dbUser,
    });
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Something went wrong during login.");
  }
};

// ── LOGOUT ────────────────────────────────────────
const logout = async (req, res) => {
  try {
    await supabase.auth.signOut();
    return sendSuccess(res, 200, "Logged out successfully.");
  } catch (err) {
    return sendError(res, 500, "Something went wrong during logout.");
  }
};

// ── RESEND VERIFICATION ───────────────────────────
const resendVerification = async (req, res) => {
  const { email } = req.body;

  if (!email) return sendError(res, 400, "Email is required.");

  try {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${process.env.CLIENT_URL}/verify-email`,
      },
    });

    if (error) return sendError(res, 400, error.message);

    return sendSuccess(res, 200, "Verification email resent successfully.");
  } catch (err) {
    return sendError(res, 500, "Something went wrong.");
  }
};

// ── GET ME ────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { doctor: true, patient: true },
    });

    if (!dbUser) return sendError(res, 404, "User not found.");

    return sendSuccess(res, 200, "User fetched successfully.", dbUser);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Something went wrong.");
  }
};
// ── COMPLETE PROFILE (Google OAuth users) ─────────
const completeProfile = async (req, res) => {
  const { name, role, dob, gender, specialization, qualification, experience } = req.body;

  try {
    const supabaseUserId = req.user.id;
    const email = req.user.email;

    // Check if user already exists in DB
    const existingUser = await prisma.user.findUnique({
      where: { id: supabaseUserId },
    });

    if (existingUser) {
      return sendError(res, 400, "Profile already exists.");
    }

    const user = await prisma.user.create({
      data: { id: supabaseUserId, email, role },
    });

    if (role === "DOCTOR") {
      await prisma.doctor.create({
        data: {
          userId: user.id, name,
          specialization: specialization || "General",
          qualification: qualification || "MBBS",
          experience: parseInt(experience) || 0,
        },
      });
    } else {
      await prisma.patient.create({
        data: {
          userId: user.id, name,
          dob: new Date(dob) || new Date(),
          gender: gender || "OTHER",
        },
      });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: supabaseUserId },
      include: { doctor: true, patient: true },
    });

    return sendSuccess(res, 201, "Profile created successfully.", dbUser);
  } catch (err) {
    console.error(err);
    return sendError(res, 500, "Something went wrong.");
  }
};

module.exports = { signup, login, logout, resendVerification, getMe, completeProfile };