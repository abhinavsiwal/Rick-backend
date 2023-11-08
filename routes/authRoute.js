const express = require("express");
const router = express.Router();

const {login,signup,getAllUsers} = require("../controllers/authController");

router.post("/login", login);
router.post("/signup", signup);
router.get("/getAllUsers", getAllUsers);

module.exports = router;