const User = require("../models/User");
const { createJwtToken } = require("../utils/createToken");
const { body, validationResult } = require("express-validator");
const { verifyJwtToken } = require("../utils/verifyToken");
const argon2 = require("argon2");
const moment = require("moment");

exports.login = [
  body("email").isEmail().withMessage("Please enter a valid email address."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),

  async (req, res, next) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Invalid value(s).");
      error.status = 422;
      error.data = errors.array();
      return next(error);
    }

    const { email, password } = req.body;
    let existingUser;
    try {
      existingUser = await User.findOne({ email });
    } catch (err) {
      console.log(err);
      const error = new Error("User not found.");
      error.status = 401;
      return next(error);
    }

    if (!existingUser) {
      const error = new Error("User not found.");
      error.status = 401;
      return next(error);
    }
    const isMathched = await argon2.verify(existingUser.password, password);

    if (!isMathched) {
      const error = new Error("Password is incorrect.");
      error.status = 401;
      return next(error);
    }

    let token;
    try {
      token = createJwtToken({ userId: existingUser._id });
    } catch (error) {
      return next(error);
    }

    res.status(200).json({
      message: "Login success.",
      token,
      user: existingUser,
    });
  },
];

exports.signup = [
  body("email").isEmail().withMessage("Please enter a valid email address."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
  body("role").notEmpty().withMessage("Role is required."),
  body("name").notEmpty().withMessage("Name is required."),

  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Invalid value(s).");
      error.status = 422;
      error.data = errors.array();
      return next(error);
    }

    const { email, password, role, name } = req.body;
    try {
      let existingUser = await User.findOne({ email });
      if (existingUser) {
        const error = new Error("User already exists.");
        error.status = 401;
        return next(error);
      }

      const hash = await argon2.hash(password);

      const newUser = new User({
        email,
        password: hash,
        role,
        name,
      });
      await newUser.save();
      res.status(201).json({
        message: "Signup success.",
        user: newUser,
      });
    } catch (err) {
      console.log(err);
      const error = new Error("Signup failed.");
      error.status = 401;
      return next(error);
    }
  },
];

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({ users });
  } catch (err) {
    console.log(err);
    const error = new Error("Fetching users failed.");
    error.status = 500;
    return next(error);
  }
};
