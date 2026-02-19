"use strict";

const fs = require("fs").promises;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" ORDER BY id ASC`,
      {
        type: Sequelize.QueryTypes.SELECT,
      },
    );

    if (!users.length) {
      throw new Error("Users table is empty. Run Users seeder first.");
    }

    let profiles = JSON.parse(
      await fs.readFile("./data/profiles.json", "utf8"),
    );

    profiles = profiles.map((el, index) => ({
      bio: el.bio,
      education: el.education,
      consultationFee: el.consultationFee,
      availableOnline: el.availableOnline,

      UserId: users[index % users.length].id,

      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("Profiles", profiles);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Profiles", null, {});
  },
};
