const jwt = require("jsonwebtoken");
const { sendError } = require("../utils/response");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) {
    return sendError(res, 401, "Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return sendError(res, 403, "Invalid or expired token.");
  }
};

module.exports = verifyToken;