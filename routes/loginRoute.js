const express = require("express");
const AuthController = require("../controller/AuthController");
const router = express.Router();

router.post("/", AuthController.login);
router.post("/google-login", AuthController.googleLogin);
module.exports = router;
