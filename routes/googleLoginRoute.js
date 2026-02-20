const express = require("express");
const router = express.Router();
const AuthController = require("../controller/AuthController");
router.post("/", AuthController.googleLogin);

module.exports = router;
