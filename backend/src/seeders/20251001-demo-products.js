"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert(
      "products",
      [
        {
          name: "Áo Thun Basic",
          description: "Áo thun unisex cotton thoáng mát, form regular.",
          price: 199000,
          stock_quantity: 120,
          image_url: "/uploads/products/aothunbasic.jpg",
          category_id: null,
          brand_id: null,
          created_at: now,
          updated_at: now,
        },
        {
          name: "Áo Hoodie Oversize",
          description: "Hoodie oversize nỉ bông dày dặn, ấm áp.",
          price: 399000,
          stock_quantity: 80,
          image_url: "/uploads/products/aohoodie.jpg",
          category_id: null,
          brand_id: null,
          created_at: now,
          updated_at: now,
        },
        {
          name: "Quần Jeans ",
          description: "Jeans co giãn nhẹ, wash trẻ trung.",
          price: 459000,
          stock_quantity: 60,
          image_url: "/uploads/products/quanjean.jpg",
          category_id: null,
          brand_id: null,
          created_at: now,
          updated_at: now,
        },
        {
          name: "Áo Khoác Nam Jacket Denim Light Blue Form Loose",
          description: "Áo khoác varsity phong cách, bo tay bo gấu.",
          price: 549000,
          stock_quantity: 40,
          image_url: "/uploads/products/jacket.jpg",
          category_id: null,
          brand_id: null,
          created_at: now,
          updated_at: now,
        },
        {
          name: "Mũ Lưỡi Trai Classic",
          description: "Cap logo thêu, chất liệu bền nhẹ.",
          price: 159000,
          stock_quantity: 150,
          image_url: "/uploads/products/muluoitrai.jpg",
          category_id: null,
          brand_id: null,
          created_at: now,
          updated_at: now,
        },
        
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("products", null, {});
  },
};
