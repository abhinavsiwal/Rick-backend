const express = require("express");
const router = express.Router();
const { checkAuth } = require("../middlewares/checkAuth");
const {
  getDashboardData,
  getReport,
  createTracking,
  getAllManualTracking,
} = require("../controllers/dashboardController");

router.get("/getDashboardData", getDashboardData);
router.get("/getReport", getReport);
router.post("/createTracking", checkAuth, createTracking);
router.get("/getTracking", checkAuth, getAllManualTracking);

module.exports = router;
