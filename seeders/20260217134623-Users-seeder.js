"use strict";

const fs = require("fs").promises;
const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {
    let users = JSON.parse(await fs.readFile("./data/users.json", "utf8"));

    users = users.map((el) => {
      delete el.id;

      return {
        email: el.email,
        password: bcrypt.hashSync(el.password, 10),
        role: el.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    await queryInterface.bulkInsert("Users", users);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
