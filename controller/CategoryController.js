const Category = require("../models/category");

class CategoryController {
  static async read(req, res, next) {
    try {
      const category = await Category.findAll();
      res.status(200).json({
        message: "Succedd Read Category",
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const { name, description } = req.body;
      const category = await Category.create({
        name,
        description,
      });
      res.status(201).json({
        message: `Succedd create new product ${category.name}`,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const category = await Category.findByPk(id, {
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });
      if (!category) throw { name: "NotFound" };
      const { name, description } = req.body;
      await category.update({ name, description });
      res.status(200).json({
        message: "update succeed",
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = CategoryController;
