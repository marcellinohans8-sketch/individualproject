const express = require("express");
const AuthController = require("../controller/AuthController");
const router = express.Router();

router.post("/", AuthController.register);

module.exports = router;
