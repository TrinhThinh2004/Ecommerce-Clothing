// migrations/YYYYMMDD-create-reviews.js
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("reviews", {
      review_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "products",
          key: "product_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "user_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      rating: {
        type: Sequelize.TINYINT,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("pending", "approved", "rejected"),
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

    // Thêm indexes
    await queryInterface.addIndex("reviews", ["product_id"], {
      name: "idx_reviews_product_id",
    });
    await queryInterface.addIndex("reviews", ["user_id"], {
      name: "idx_reviews_user_id",
    });
    await queryInterface.addIndex("reviews", ["status"], {
      name: "idx_reviews_status",
    });
    await queryInterface.addIndex("reviews", ["rating"], {
      name: "idx_reviews_rating",
    });
    await queryInterface.addIndex("reviews", ["created_at"], {
      name: "idx_reviews_created_at",
    });

    // Thêm unique constraint: mỗi user chỉ review 1 lần cho mỗi sản phẩm
    await queryInterface.addConstraint("reviews", {
      fields: ["user_id", "product_id"],
      type: "unique",
      name: "unique_user_product_review",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("reviews");
  },
};