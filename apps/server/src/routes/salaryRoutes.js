const express = require("express");
const router = express.Router();
const salaryController = require("../controllers/salaryController");

router.get("/", salaryController.getWeeklySalary);

module.exports = router;
