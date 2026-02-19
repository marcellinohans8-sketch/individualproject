const express = require("express");
const LawyerController = require("../controller/lawyerController");
const { authorization } = require("../middlewares/authentication");
const router = express.Router();

router.post("/", LawyerController.create);
router.get("/", LawyerController.read);
router.get("/:id", LawyerController.detail);
router.put("/:id", authorization, LawyerController.update);
router.delete("/:id", authorization, LawyerController.delete);
module.exports = router;
