"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("orders", {
      order_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "users", key: "user_id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      full_name: { type: Sequelize.STRING(100), allowNull: false },
      phone: { type: Sequelize.STRING(15), allowNull: false },
      address: { type: Sequelize.STRING(255), allowNull: false },
      city: { type: Sequelize.STRING(50), allowNull: false },
      district: { type: Sequelize.STRING(50), allowNull: true },
      ward: { type: Sequelize.STRING(50), allowNull: true },
      note: { type: Sequelize.TEXT, allowNull: true },
      voucher_code: { type: Sequelize.STRING(50), allowNull: true },
      discount_amount: {
        type: Sequelize.DECIMAL(12, 0),
        allowNull: false,
        defaultValue: 0,
      },
      shipping_fee: {
        type: Sequelize.DECIMAL(12, 0),
        allowNull: false,
        defaultValue: 0,
      },
      total_price: { type: Sequelize.DECIMAL(12, 0), allowNull: false },
      payment_method: {
        type: Sequelize.ENUM("cod", "vnpay", "momo"),
        allowNull: false,
      },
      payment_status: {
        type: Sequelize.ENUM("pending", "paid", "failed"),
        allowNull: false,
        defaultValue: "pending",
      },
      status: {
        type: Sequelize.ENUM(
          "pending",
          "processing",
          "shipping",
          "completed",
          "cancelled"
        ),
        allowNull: false,
        defaultValue: "pending",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("orders");
  },
};
