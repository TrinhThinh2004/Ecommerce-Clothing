"use strict";

const bcrypt = require("bcrypt");
require("dotenv").config();

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const saltRounds = 10;

    const adminPassword = await bcrypt.hash(
      process.env.ADMIN_PASSWORD,
      saltRounds
    );

    const userPassword = await bcrypt.hash("user123", saltRounds);

    await queryInterface.bulkInsert(
      "users",
      [
        {
          username: "admin",
          email: "admin@gmail.com",
          password_hash: adminPassword,
          phone_number: "0901234567",
          role: "admin",
          created_at: now,
          updated_at: now,
        },
        {
          username: "user01",
          email: "user01@gmail.com",
          password_hash: userPassword,
          phone_number: "0907654321",
          role: "user",
          created_at: now,
          updated_at: now,
        },
        {
          username: "user02",
          email: "user02@gmail.com",
          password_hash: userPassword,
          phone_number: "0908765432",
          role: "user",
          created_at: now,
          updated_at: now,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
