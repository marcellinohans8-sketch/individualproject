const { Lawyer, User, Profile, Category } = require("../models");
const { Op } = require("sequelize");

class PublicLawyerController {
  static async list(req, res, next) {
    try {
      const { search, CategoryId, page = 1, sort } = req.query;

      const limit = 10;
      const currentPage = Number(page);
      const offset = (currentPage - 1) * limit;

      const where = {};

      if (search) {
        where.fullName = {
          [Op.like]: `%${search}%`,
        };
      }

      if (CategoryId) {
        where.CategoryId = Number(CategoryId);
      }

      let order = [["id", "DESC"]];
      if (sort && ["ASC", "DESC"].includes(sort.toUpperCase())) {
        order = [["id", sort.toUpperCase()]];
      }

      const { rows, count } = await Lawyer.findAndCountAll({
        where,
        limit,
        offset,
        order,
        distinct: true,
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: [
          {
            model: Category,
            attributes: ["id", "name"],
          },
          {
            model: User,
            attributes: ["id", "email"],
            required: false,
            include: [
              {
                model: Profile,
                attributes: ["consultationFee", "availableOnline"],
                required: false,
              },
            ],
          },
        ],
      });

      res.status(200).json({
        data: rows,
        currentPage,
        totalPages: Math.ceil(count / limit),
        totalData: count,
      });
    } catch (err) {
      next(err);
    }
  }

  static async detail(req, res, next) {
    try {
      const { id } = req.params;

      const lawyer = await Lawyer.findOne({
        where: { id },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: [
          {
            model: Category,
            attributes: ["id", "name"],
          },
          {
            model: User,
            attributes: ["id", "email"],
            required: false,
            include: [
              {
                model: Profile,
                attributes: [
                  "bio",
                  "education",
                  "consultationFee",
                  "availableOnline",
                ],
                required: false,
              },
            ],
          },
        ],
      });

      if (!lawyer) {
        return res.status(404).json({
          message: "Lawyer not found",
        });
      }

      res.status(200).json({ data: lawyer });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = PublicLawyerController;
