"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Tạo bảng cart
    await queryInterface.createTable("cart", {
      cart_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        comment: "ID giỏ hàng",
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: "Người sở hữu giỏ hàng",
        references: {
          model: "users", 
          key: "user_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: "Sản phẩm trong giỏ",
        references: {
          model: "products", 
          key: "product_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      size: {
        type: Sequelize.STRING(10),
        allowNull: true,
        comment: "Kích cỡ sản phẩm (nếu có)",
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: "Số lượng sản phẩm",
      },
      price_snapshot: {
        type: Sequelize.DECIMAL(12, 0),
        allowNull: false,
        comment: "Giá tại thời điểm thêm vào giỏ",
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
    }, {
      engine: 'InnoDB', 
    });

  
    await queryInterface.addIndex("cart", ["user_id"]);
    await queryInterface.addIndex("cart", ["product_id"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("cart");
  },
};
