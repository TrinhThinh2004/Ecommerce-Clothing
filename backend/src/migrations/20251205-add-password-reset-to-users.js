module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "password_reset_token", {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "One-time token for password reset (dev use).",
    });

    await queryInterface.addColumn("users", "password_reset_expires", {
      type: Sequelize.DATE,
      allowNull: true,
      comment: "Expiry timestamp for password reset token",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "password_reset_token");
    await queryInterface.removeColumn("users", "password_reset_expires");
  },
};
