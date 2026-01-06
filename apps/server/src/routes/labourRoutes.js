const express = require("express");
const router = express.Router();
const labourController = require("../controllers/labourController");

router.get("/", labourController.getLabours);
router.post("/", labourController.createLabour);
router.put("/:id", labourController.updateLabour);
router.delete("/:id", labourController.deleteLabour);

module.exports = router;
