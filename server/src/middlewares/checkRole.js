const { sendError } = require("../utils/response");

const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 401, "Unauthorized. Please login.");
    }

    const userRole = req.user.user_metadata?.role;

    if (!roles.includes(userRole)) {
      return sendError(res, 403, "Forbidden. You don't have access to this resource.");
    }

    next();
  };
};

module.exports = checkRole;