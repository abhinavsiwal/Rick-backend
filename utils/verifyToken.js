const jwt = require("jsonwebtoken");

const secret_key = process.env.JWT_SECRET;

exports.verifyJwtToken = (token, next) => {
  try {
    const { userId } = jwt.verify(token, secret_key);
    return userId;
  } catch (err) {
    next(err);
  }
};
