const express = require("express");
const ProfileController = require("../controller/ProfileController");
const router = express.Router();

router.post("/", ProfileController.create);
router.get("/", ProfileController.read);
router.put("/:id", ProfileController.update);

module.exports = router;
