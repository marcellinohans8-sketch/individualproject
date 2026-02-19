"use strict";

const fs = require("fs").promises;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      `SELECT id FROM "Users" ORDER BY id ASC`,
      { type: Sequelize.QueryTypes.SELECT },
    );

    const categories = await queryInterface.sequelize.query(
      `SELECT id FROM "Categories" ORDER BY id ASC`,
      { type: Sequelize.QueryTypes.SELECT },
    );

    if (!users.length) throw new Error("Users empty");
    if (!categories.length) throw new Error("Categories empty");

    let lawyers = JSON.parse(await fs.readFile("./data/lawyers.json", "utf8"));
    lawyers = lawyers.map((el, index) => ({
      fullName: el.fullName,
      officeAddress: el.officeAddress,
      rating: el.rating,
      photoUrl: el.photoUrl,

      UserId: users[index % users.length].id,
      CategoryId: categories[index % categories.length].id,

      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await queryInterface.bulkInsert("Lawyers", lawyers);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Lawyers", null, {});
  },
};
