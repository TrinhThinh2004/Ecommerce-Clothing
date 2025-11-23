"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("messages", {
      message_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      sender_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "users", key: "user_id" },
        onDelete: "CASCADE",
      },
      receiver_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: "users", key: "user_id" },
        onDelete: "CASCADE",
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      is_from_admin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
 
      owner_id: {
        type: Sequelize.INTEGER,
        allowNull: true, 
        references: { model: "users", key: "user_id" },
        onDelete: "CASCADE",
      },
    });

    await queryInterface.sequelize.query(
      `UPDATE messages SET owner_id = sender_id WHERE owner_id IS NULL;`
    );

    await queryInterface.changeColumn("messages", "owner_id", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: "users", key: "user_id" },
      onDelete: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("messages");
  },
};
