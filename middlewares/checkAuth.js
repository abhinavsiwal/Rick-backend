const User = require("../models/User");

const { verifyJwtToken } = require("../utils/verifyToken");

exports.checkAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(403).json({ message: "Authorization token missing" });
    }
    const token = header.split("Bearer ")[1];

    if (!token) {
      const error = new Error("Token not found.");
      error.status = 401;
      return next(error);
    }

    const userId = verifyJwtToken(token);

    if (!userId) {
      const error = new Error("Token not Decoded.");
      error.status = 401;
      return next(error);
    }

    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found.");
      error.status = 401;
      return next(error);
    }
    req.user = user;
    next();
  } catch (err) {
    const error = new Error("User not found.");
    error.status = 401;
    error.data = err.message;
    return next(error);
  }
};
