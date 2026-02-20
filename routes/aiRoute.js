const express = require("express");
const router = express.Router();
const aiController = require("../controller/aiController");

router.post("/recommend", aiController.recommend);

module.exports = router;
