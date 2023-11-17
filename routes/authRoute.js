const express = require("express");
const router = express.Router();

const {
  login,
  signup,
  getAllUsers,
  changePassword,
  deleteUser
} = require("../controllers/authController");
const { checkAuth } = require("../middlewares/checkAuth");

router.post("/login", login);
router.post("/signup", signup);
router.get("/getAllUsers", getAllUsers);
router.put("/changePassword", checkAuth, changePassword);
router.delete("/deleteUser/:id", checkAuth, deleteUser)
module.exports = router;
