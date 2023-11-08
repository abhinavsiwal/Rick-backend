const express = require("express");
const router = express.Router();

const {
  getDashboardData,
  getReport,
} = require("../controllers/dashboardController");

router.get("/getDashboardData", getDashboardData);
router.get("/getReport", getReport);

module.exports = router;
