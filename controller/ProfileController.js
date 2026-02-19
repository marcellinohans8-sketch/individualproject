const { Profile } = require("../models");

class ProfileController {
  static async read(req, res, next) {
    try {
      const profil = await Profile.findAll();
      res.status(200).json({
        message: "Succedd Read Profile",
        data: profil,
      });
    } catch (error) {
      next(error);
    }
  }
  static async create(req, res, next) {
    try {
      const { bio, education, consultationFee, availableOnline } = req.body;
      const { userId } = req.loginInfo;

      const profile = await Profile.create({
        UserId: userId,
        bio,
        education,
        consultationFee,
        availableOnline,
      });

      res.status(201).json({
        message: "Success create profile",
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req, res, next) {
    try {
      const { id } = req.params;
      const profile = await Profile.findByPk(id);
      if (!profile) throw { name: "NotFound" };
      const { bio, education, consultationFee, availableOnline } = req.body;

      await profile.update({
        bio,
        education,
        consultationFee,
        availableOnline,
      });

      res.status(200).json({
        message: "Update succeed",
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProfileController;
