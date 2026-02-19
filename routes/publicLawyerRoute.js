const express = require("express");
const router = express.Router();

const PublicLawyerController = require("../controller/PublicController");
const { Category } = require("../models");

router.get("/lawyers", PublicLawyerController.list);
router.get("/lawyers/:id", PublicLawyerController.detail);

router.get("/categories", async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      attributes: ["id", "name"],
    });

    res.status(200).json({
      data: categories,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
