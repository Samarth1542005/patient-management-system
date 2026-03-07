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
    // 1. Create user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role }, // stored in user_metadata
      },
    });

    if (error) return sendError(res, 400, error.message);

    const supabaseUserId = data.user.id;

    // 2. Create User record in our DB
    const user = await prisma.user.create({
      data: {
        id: supabaseUserId, // keep IDs in sync
        email,
        role,
      },
    });

    // 3. Create Doctor or Patient profile
    if (role === "DOCTOR") {
      await prisma.doctor.create({
        data: {
          userId: user.id,
          name,
          specialization: req.body.specialization || "General",
          qualification: req.body.qualification || "MBBS",
          experience: req.body.experience || 0,
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

    return sendSuccess(res, 201, "Account created successfully. Please verify your email.");
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

    const { access_token, user } = data.session ? 
      { access_token: data.session.access_token, user: data.user } : 
      { access_token: null, user: null };

    if (!access_token) return sendError(res, 401, "Login failed.");

    // Fetch profile from our DB
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        doctor: true,
        patient: true,
      },
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

module.exports = { signup, login, logout };