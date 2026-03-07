const { createClient } = require("@supabase/supabase-js");
const { sendError } = require("../utils/response");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return sendError(res, 401, "Access denied. No token provided.");
  }

  try {
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return sendError(res, 403, "Invalid or expired token.");
    }

    req.user = data.user;
    next();
  } catch (err) {
    return sendError(res, 403, "Invalid or expired token.");
  }
};

module.exports = verifyToken;