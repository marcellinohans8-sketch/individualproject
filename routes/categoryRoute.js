const express = require("express");
const CategoryController = require("../controller/CategoryController");
const router = express.Router();

router.post("/", CategoryController.create);
router.get("/", CategoryController.read);
router.put("/:id", CategoryController.update);

module.exports = router;
