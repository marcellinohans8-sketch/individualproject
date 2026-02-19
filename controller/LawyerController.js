const { User, Lawyer, Profile, Category } = require("../models");

const client = require("../helpers/uploadcare");

class LawyerController {
  static async read(req, res, next) {
    try {
      const lawyers = await Lawyer.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: [
          {
            model: User,
            attributes: ["id", "email"],
            include: [
              {
                model: Profile,
                attributes: [
                  "bio",
                  "education",
                  "consultationFee",
                  "availableOnline",
                ],
              },
            ],
          },
          {
            model: Category,
            attributes: ["id", "name"],
          },
        ],
        order: [["updatedAt", "DESC"]],
      });

      res.status(200).json({
        data: lawyers,
      });
    } catch (error) {
      next(error);
    }
  }
  static async detail(req, res, next) {
    try {
      const { id } = req.params;

      const lawyer = await Lawyer.findByPk(id, {
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: [
          {
            model: User,
            attributes: ["id", "email", "fullName", "photoUrl"],
            include: [
              {
                model: Profile,
                attributes: [
                  "bio",
                  "education",
                  "consultationFee",
                  "availableOnline",
                ],
              },
            ],
          },
          {
            model: Category,
            attributes: ["id", "name"],
          },
        ],
      });

      if (!lawyer) throw { name: "NotFound" };

      res.status(200).json({
        data: lawyer,
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req, res, next) {
    try {
      const {
        CategoryId,
        fullName,
        officeAddress,
        photoUrl,
        bio,
        education,
        consultationFee,
        availableOnline,
      } = req.body;

      const { id: userId } = req.user;

      await User.update({ fullName, photoUrl }, { where: { id: userId } });

      let profile = await Profile.findOne({
        where: { UserId: userId },
      });

      if (profile) {
        await profile.update({
          bio,
          education,
          consultationFee,
          availableOnline,
        });
      } else {
        await Profile.create({
          UserId: userId,
          bio,
          education,
          consultationFee,
          availableOnline,
        });
      }

      const lawyer = await Lawyer.create({
        CategoryId,
        officeAddress,
        rating: 0,
        UserId: userId,
      });

      res.status(201).json({ lawyer });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { CategoryId, fullName, officeAddress, rating, photoUrl } =
        req.body;
      const { id } = req.params;
      const lawyer = await Lawyer.findByPk(id);
      if (!lawyer) throw { name: "NotFound" };
      await lawyer.update({
        CategoryId,
        fullName,
        officeAddress,
        rating,
        photoUrl,
      });
      delete lawyer.dataValues.createdAt;
      delete lawyer.dataValues.updatedAt;
      res.status(200).json({ lawyer });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;

      const lawyer = await Lawyer.findByPk(id);
      if (!lawyer) throw { name: "NotFound" };

      await lawyer.destroy();

      res.status(200).json({
        message: "Lawyer has been deleted",
      });
    } catch (error) {
      next(error);
    }
  }

  static async uploadImage(req, res, next) {
    try {
      const { id } = req.params;

      const lawyer = await Lawyer.findByPk(id);
      if (!lawyer) throw { name: "NotFound" };

      if (!req.file) throw { name: "BadRequest" };

      const result = await client.uploadFile(req.file.buffer, {
        fileName: req.file.originalname,
        contentType: "image/jpeg",
        store: true,
      });

      await lawyer.update({
        photoUrl: result.cdnUrl,
      });

      res.status(200).json({
        message: "Upload success",
        photoUrl: result.cdnUrl,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}
module.exports = LawyerController;
