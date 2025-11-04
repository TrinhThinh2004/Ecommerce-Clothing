"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert(
      "categories",
      [
        // Áo Nam
        { name: "Áo Thun", parent_id: null, created_at: now, updated_at: now },
        { name: "Sơ Mi", parent_id: null, created_at: now, updated_at: now },
        { name: "Áo Khoác", parent_id: null, created_at: now, updated_at: now },

        // Quần Nam
        { name: "Jeans", parent_id: null, created_at: now, updated_at: now },
        { name: "Kaki", parent_id: null, created_at: now, updated_at: now },
        { name: "Jogger", parent_id: null, created_at: now, updated_at: now },

        // Phụ kiện
        { name: "Dây Nịt", parent_id: null, created_at: now, updated_at: now },
        { name: "Mũ", parent_id: null, created_at: now, updated_at: now },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("categories", null, {});
  },
};
