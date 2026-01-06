const express = require("express");
const router = express.Router();
const advanceController = require("../controllers/advanceController");

router.post("/", advanceController.createAdvance);
router.get("/", advanceController.getAdvances);
router.delete("/:id", advanceController.deleteAdvance);

module.exports = router;
