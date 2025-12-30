const express = require("express");
const router = express.Router();
const productionController = require("../controllers/productionController");

router.get("/", productionController.getProduction);
router.post("/", productionController.createProductionEntry);

module.exports = router;
