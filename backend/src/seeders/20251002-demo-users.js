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
        {
          username: "user03",
          email: "user@gmail.com",
          password_hash: userPassword,
          phone_number: "0909876543",
          role: "user",
          created_at: now,
          updated_at: now,
        },
        {
          username: "user04",
          email: "user04@gmail.com",
          password_hash: userPassword,
          phone_number: "0900987654",
          role: "user",
          created_at: now,
          updated_at: now,
        },
        {
          username: "user05",
          email: "user05@gmail.com",
          password_hash: userPassword,
          phone_number: "0901098765",
          role: "user",
          created_at: now,
          updated_at: now,
        }
        , {
          username: "user06",
          email: "user06@gmail.com",
          password_hash: userPassword,
          phone_number: "0902109876",
          role: "user",
          created_at: now,
          updated_at: now,
        },
        {
          username: "user07",
          email: "user07@gmail.com",
          password_hash: userPassword,
          phone_number: "0903210987",
          role: "user",
          created_at: now,
          updated_at: now,
        },
        {
          username: "user08",
          email: "user08@gmail.com",
          password_hash: userPassword,
          phone_number: "0904321098",
          role: "user",
          created_at: now,
          updated_at: now,
        },
        {
          username: "user09",
          email: "user09@gmail.com",
          password_hash: userPassword,
          phone_number: "0905432109",
          role: "user",
          created_at: now,
          updated_at: now,
        },
        {
          username: "user10",
          email: "user10@gmail.com",
          password_hash: userPassword,
          phone_number: "0906543210",
          role: "user",
          created_at: now,
          updated_at: now,
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
