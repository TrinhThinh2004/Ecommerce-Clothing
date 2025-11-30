"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // This seeder creates 5 explicit COD orders for each demo user user01..user10
    // Dates are spread across November 2025 so admin statistics have realistic distribution.
    // Note field format: seed-orders-<username>-<n>

    // user01 orders
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 01', '0907654321', 'Địa chỉ HCM - Q1', 'Hồ Chí Minh', 'seed-orders-user01-1', 0, 30000, 199000, 'cod', 'paid', 'completed', '2025-11-02 10:00:00', '2025-11-02 10:00:00' FROM users u WHERE u.username = 'user01'
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 01', '0907654321', 'Địa chỉ HCM - Q1', 'Hồ Chí Minh', 'seed-orders-user01-2', 0, 30000, 249000, 'cod', 'paid', 'completed', '2025-11-06 12:30:00', '2025-11-06 12:30:00' FROM users u WHERE u.username = 'user01'
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 01', '0907654321', 'Địa chỉ HCM - Q1', 'Hồ Chí Minh', 'seed-orders-user01-3', 0, 30000, 299000, 'cod', 'paid', 'completed', '2025-11-11 09:15:00', '2025-11-11 09:15:00' FROM users u WHERE u.username = 'user01'
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 01', '0907654321', 'Địa chỉ HCM - Q1', 'Hồ Chí Minh', 'seed-orders-user01-4', 0, 30000, 229000, 'cod', 'paid', 'completed', '2025-11-18 15:40:00', '2025-11-18 15:40:00' FROM users u WHERE u.username = 'user01'
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 01', '0907654321', 'Địa chỉ HCM - Q1', 'Hồ Chí Minh', 'seed-orders-user01-5', 0, 30000, 189000, 'cod', 'paid', 'completed', '2025-11-24 18:20:00', '2025-11-24 18:20:00' FROM users u WHERE u.username = 'user01'
    `);

    // user02 orders
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 02', '0908765432', 'Địa chỉ HCM - Q3', 'Hồ Chí Minh', 'seed-orders-user02-1', 0, 30000, 159000, 'cod', 'paid', 'completed', '2025-11-03 11:00:00', '2025-11-03 11:00:00' FROM users u WHERE u.username = 'user02'
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 02', '0908765432', 'Địa chỉ HCM - Q3', 'Hồ Chí Minh', 'seed-orders-user02-2', 0, 30000, 219000, 'cod', 'paid', 'completed', '2025-11-07 13:20:00', '2025-11-07 13:20:00' FROM users u WHERE u.username = 'user02'
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 02', '0908765432', 'Địa chỉ HCM - Q3', 'Hồ Chí Minh', 'seed-orders-user02-3', 0, 30000, 279000, 'cod', 'paid', 'completed', '2025-11-12 10:30:00', '2025-11-12 10:30:00' FROM users u WHERE u.username = 'user02'
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 02', '0908765432', 'Địa chỉ HCM - Q3', 'Hồ Chí Minh', 'seed-orders-user02-4', 0, 30000, 199000, 'cod', 'paid', 'completed', '2025-11-19 16:50:00', '2025-11-19 16:50:00' FROM users u WHERE u.username = 'user02'
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 02', '0908765432', 'Địa chỉ HCM - Q3', 'Hồ Chí Minh', 'seed-orders-user02-5', 0, 30000, 329000, 'cod', 'paid', 'completed', '2025-11-25 09:10:00', '2025-11-25 09:10:00' FROM users u WHERE u.username = 'user02'
    `);

    // user03 orders
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 03', '0909876543', 'Địa chỉ HCM - Q7', 'Hồ Chí Minh', 'seed-orders-user03-1', 0, 30000, 259000, 'cod', 'paid', 'completed', '2025-11-04 08:30:00', '2025-11-04 08:30:00' FROM users u WHERE u.username = 'user03'
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 03', '0909876543', 'Địa chỉ HCM - Q7', 'Hồ Chí Minh', 'seed-orders-user03-2', 0, 30000, 219000, 'cod', 'paid', 'completed', '2025-11-08 12:00:00', '2025-11-08 12:00:00' FROM users u WHERE u.username = 'user03'
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 03', '0909876543', 'Địa chỉ HCM - Q7', 'Hồ Chí Minh', 'seed-orders-user03-3', 0, 30000, 199000, 'cod', 'paid', 'completed', '2025-11-13 15:00:00', '2025-11-13 15:00:00' FROM users u WHERE u.username = 'user03'
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 03', '0909876543', 'Địa chỉ HCM - Q7', 'Hồ Chí Minh', 'seed-orders-user03-4', 0, 30000, 289000, 'cod', 'paid', 'completed', '2025-11-20 11:20:00', '2025-11-20 11:20:00' FROM users u WHERE u.username = 'user03'
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 03', '0909876543', 'Địa chỉ HCM - Q7', 'Hồ Chí Minh', 'seed-orders-user03-5', 0, 30000, 159000, 'cod', 'paid', 'completed', '2025-11-26 17:30:00', '2025-11-26 17:30:00' FROM users u WHERE u.username = 'user03'
    `);

    // user04 orders
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 04', '0900987654', 'Địa chỉ HCM - Q5', 'Hồ Chí Minh', 'seed-orders-user04-1', 0, 30000, 209000, 'cod', 'paid', 'completed', '2025-11-05 09:40:00', '2025-11-05 09:40:00' FROM users u WHERE u.username = 'user04'
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 04', '0900987654', 'Địa chỉ HCM - Q5', 'Hồ Chí Minh', 'seed-orders-user04-2', 0, 30000, 179000, 'cod', 'paid', 'completed', '2025-11-09 14:00:00', '2025-11-09 14:00:00' FROM users u WHERE u.username = 'user04'
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 04', '0900987654', 'Địa chỉ HCM - Q5', 'Hồ Chí Minh', 'seed-orders-user04-3', 0, 30000, 249000, 'cod', 'paid', 'completed', '2025-11-14 10:10:00', '2025-11-14 10:10:00' FROM users u WHERE u.username = 'user04'
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 04', '0900987654', 'Địa chỉ HCM - Q5', 'Hồ Chí Minh', 'seed-orders-user04-4', 0, 30000, 199000, 'cod', 'paid', 'completed', '2025-11-21 16:00:00', '2025-11-21 16:00:00' FROM users u WHERE u.username = 'user04'
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 04', '0900987654', 'Địa chỉ HCM - Q5', 'Hồ Chí Minh', 'seed-orders-user04-5', 0, 30000, 159000, 'cod', 'paid', 'completed', '2025-11-27 12:00:00', '2025-11-27 12:00:00' FROM users u WHERE u.username = 'user04'
    `);

    // user05 orders
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 05', '0901098765', 'Địa chỉ HCM - Q2', 'Hồ Chí Minh', 'seed-orders-user05-1', 0, 30000, 179000, 'cod', 'paid', 'completed', '2025-11-06 08:00:00', '2025-11-06 08:00:00' FROM users u WHERE u.username = 'user05'
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 05', '0901098765', 'Địa chỉ HCM - Q2', 'Hồ Chí Minh', 'seed-orders-user05-2', 0, 30000, 269000, 'cod', 'paid', 'completed', '2025-11-10 13:00:00', '2025-11-10 13:00:00' FROM users u WHERE u.username = 'user05'
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 05', '0901098765', 'Địa chỉ HCM - Q2', 'Hồ Chí Minh', 'seed-orders-user05-3', 0, 30000, 349000, 'cod', 'paid', 'completed', '2025-11-15 15:30:00', '2025-11-15 15:30:00' FROM users u WHERE u.username = 'user05'
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 05', '0901098765', 'Địa chỉ HCM - Q2', 'Hồ Chí Minh', 'seed-orders-user05-4', 0, 30000, 199000, 'cod', 'paid', 'completed', '2025-11-22 10:10:00', '2025-11-22 10:10:00' FROM users u WHERE u.username = 'user05'
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 05', '0901098765', 'Địa chỉ HCM - Q2', 'Hồ Chí Minh', 'seed-orders-user05-5', 0, 30000, 229000, 'cod', 'paid', 'completed', '2025-11-28 14:40:00', '2025-11-28 14:40:00' FROM users u WHERE u.username = 'user05'
    `);

    // user06 orders
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 06', '0902109876', 'Địa chỉ HCM - Q4', 'Hồ Chí Minh', 'seed-orders-user06-1', 0, 30000, 319000, 'cod', 'paid', 'completed', '2025-11-01 09:10:00', '2025-11-01 09:10:00' FROM users u WHERE u.username = 'user06'
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 06', '0902109876', 'Địa chỉ HCM - Q4', 'Hồ Chí Minh', 'seed-orders-user06-2', 0, 30000, 289000, 'cod', 'paid', 'completed', '2025-11-07 11:20:00', '2025-11-07 11:20:00' FROM users u WHERE u.username = 'user06'
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 06', '0902109876', 'Địa chỉ HCM - Q4', 'Hồ Chí Minh', 'seed-orders-user06-3', 0, 30000, 199000, 'cod', 'paid', 'completed', '2025-11-12 09:00:00', '2025-11-12 09:00:00' FROM users u WHERE u.username = 'user06'
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 06', '0902109876', 'Địa chỉ HCM - Q4', 'Hồ Chí Minh', 'seed-orders-user06-4', 0, 30000, 149000, 'cod', 'paid', 'completed', '2025-11-19 13:30:00', '2025-11-19 13:30:00' FROM users u WHERE u.username = 'user06'
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 06', '0902109876', 'Địa chỉ HCM - Q4', 'Hồ Chí Minh', 'seed-orders-user06-5', 0, 30000, 179000, 'cod', 'paid', 'completed', '2025-11-26 18:00:00', '2025-11-26 18:00:00' FROM users u WHERE u.username = 'user06'
    `);

    // user07 orders
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 07', '0903210987', 'Địa chỉ HCM - Q6', 'Hồ Chí Minh', 'seed-orders-user07-1', 0, 30000, 249000, 'cod', 'paid', 'completed', '2025-11-02 14:00:00', '2025-11-02 14:00:00' FROM users u WHERE u.username = 'user07'
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 07', '0903210987', 'Địa chỉ HCM - Q6', 'Hồ Chí Minh', 'seed-orders-user07-2', 0, 30000, 299000, 'cod', 'paid', 'completed', '2025-11-08 10:10:00', '2025-11-08 10:10:00' FROM users u WHERE u.username = 'user07'
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 07', '0903210987', 'Địa chỉ HCM - Q6', 'Hồ Chí Minh', 'seed-orders-user07-3', 0, 30000, 229000, 'cod', 'paid', 'completed', '2025-11-13 16:40:00', '2025-11-13 16:40:00' FROM users u WHERE u.username = 'user07'
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 07', '0903210987', 'Địa chỉ HCM - Q6', 'Hồ Chí Minh', 'seed-orders-user07-4', 0, 30000, 199000, 'cod', 'paid', 'completed', '2025-11-20 09:00:00', '2025-11-20 09:00:00' FROM users u WHERE u.username = 'user07'
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 07', '0903210987', 'Địa chỉ HCM - Q6', 'Hồ Chí Minh', 'seed-orders-user07-5', 0, 30000, 159000, 'cod', 'paid', 'completed', '2025-11-28 11:10:00', '2025-11-28 11:10:00' FROM users u WHERE u.username = 'user07'
    `);

    // user08 orders
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 08', '0904321098', 'Địa chỉ HCM - Q9', 'Hồ Chí Minh', 'seed-orders-user08-1', 0, 30000, 199000, 'cod', 'paid', 'completed', '2025-11-04 10:00:00', '2025-11-04 10:00:00' FROM users u WHERE u.username = 'user08'
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 08', '0904321098', 'Địa chỉ HCM - Q9', 'Hồ Chí Minh', 'seed-orders-user08-2', 0, 30000, 279000, 'cod', 'paid', 'completed', '2025-11-09 12:00:00', '2025-11-09 12:00:00' FROM users u WHERE u.username = 'user08'
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 08', '0904321098', 'Địa chỉ HCM - Q9', 'Hồ Chí Minh', 'seed-orders-user08-3', 0, 30000, 329000, 'cod', 'paid', 'completed', '2025-11-14 14:00:00', '2025-11-14 14:00:00' FROM users u WHERE u.username = 'user08'
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 08', '0904321098', 'Địa chỉ HCM - Q9', 'Hồ Chí Minh', 'seed-orders-user08-4', 0, 30000, 149000, 'cod', 'paid', 'completed', '2025-11-21 09:30:00', '2025-11-21 09:30:00' FROM users u WHERE u.username = 'user08'
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 08', '0904321098', 'Địa chỉ HCM - Q9', 'Hồ Chí Minh', 'seed-orders-user08-5', 0, 30000, 189000, 'cod', 'paid', 'completed', '2025-11-29 17:00:00', '2025-11-29 17:00:00' FROM users u WHERE u.username = 'user08'
    `);

    // user09 orders
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 09', '0905432109', 'Địa chỉ HCM - Q8', 'Hồ Chí Minh', 'seed-orders-user09-1', 0, 30000, 239000, 'cod', 'paid', 'completed', '2025-11-05 10:10:00', '2025-11-05 10:10:00' FROM users u WHERE u.username = 'user09'
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 09', '0905432109', 'Địa chỉ HCM - Q8', 'Hồ Chí Minh', 'seed-orders-user09-2', 0, 30000, 199000, 'cod', 'paid', 'completed', '2025-11-10 11:30:00', '2025-11-10 11:30:00' FROM users u WHERE u.username = 'user09'
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 09', '0905432109', 'Địa chỉ HCM - Q8', 'Hồ Chí Minh', 'seed-orders-user09-3', 0, 30000, 299000, 'cod', 'paid', 'completed', '2025-11-15 13:10:00', '2025-11-15 13:10:00' FROM users u WHERE u.username = 'user09'
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 09', '0905432109', 'Địa chỉ HCM - Q8', 'Hồ Chí Minh', 'seed-orders-user09-4', 0, 30000, 179000, 'cod', 'paid', 'completed', '2025-11-22 10:00:00', '2025-11-22 10:00:00' FROM users u WHERE u.username = 'user09'
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 09', '0905432109', 'Địa chỉ HCM - Q8', 'Hồ Chí Minh', 'seed-orders-user09-5', 0, 30000, 259000, 'cod', 'paid', 'completed', '2025-11-30 09:00:00', '2025-11-30 09:00:00' FROM users u WHERE u.username = 'user09'
    `);

    // user10 orders
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 10', '0906543210', 'Địa chỉ HCM - Q10', 'Hồ Chí Minh', 'seed-orders-user10-1', 0, 30000, 219000, 'cod', 'paid', 'completed', '2025-11-06 09:00:00', '2025-11-06 09:00:00' FROM users u WHERE u.username = 'user10'
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 10', '0906543210', 'Địa chỉ HCM - Q10', 'Hồ Chí Minh', 'seed-orders-user10-2', 0, 30000, 269000, 'cod', 'paid', 'completed', '2025-11-11 10:00:00', '2025-11-11 10:00:00' FROM users u WHERE u.username = 'user10'
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 10', '0906543210', 'Địa chỉ HCM - Q10', 'Hồ Chí Minh', 'seed-orders-user10-3', 0, 30000, 299000, 'cod', 'paid', 'completed', '2025-11-16 12:00:00', '2025-11-16 12:00:00' FROM users u WHERE u.username = 'user10'
    `);

    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 10', '0906543210', 'Địa chỉ HCM - Q10', 'Hồ Chí Minh', 'seed-orders-user10-4', 0, 30000, 189000, 'cod', 'paid', 'completed', '2025-11-23 15:00:00', '2025-11-23 15:00:00' FROM users u WHERE u.username = 'user10'
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO orders (user_id, full_name, phone, address, city, note, discount_amount, shipping_fee, total_price, payment_method, payment_status, status, created_at, updated_at)
      SELECT u.user_id, 'User 10', '0906543210', 'Địa chỉ HCM - Q10', 'Hồ Chí Minh', 'seed-orders-user10-5', 0, 30000, 239000, 'cod', 'paid', 'completed', '2025-11-29 10:30:00', '2025-11-29 10:30:00' FROM users u WHERE u.username = 'user10'
    `);

    // Insert order_items for all seeded orders (one item per order, offsets 0..4)
    const notes = [
      // user01
      "seed-orders-user01-1",
      "seed-orders-user01-2",
      "seed-orders-user01-3",
      "seed-orders-user01-4",
      "seed-orders-user01-5",
      // user02
      "seed-orders-user02-1",
      "seed-orders-user02-2",
      "seed-orders-user02-3",
      "seed-orders-user02-4",
      "seed-orders-user02-5",
      // user03
      "seed-orders-user03-1",
      "seed-orders-user03-2",
      "seed-orders-user03-3",
      "seed-orders-user03-4",
      "seed-orders-user03-5",
      // user04
      "seed-orders-user04-1",
      "seed-orders-user04-2",
      "seed-orders-user04-3",
      "seed-orders-user04-4",
      "seed-orders-user04-5",
      // user05
      "seed-orders-user05-1",
      "seed-orders-user05-2",
      "seed-orders-user05-3",
      "seed-orders-user05-4",
      "seed-orders-user05-5",
      // user06
      "seed-orders-user06-1",
      "seed-orders-user06-2",
      "seed-orders-user06-3",
      "seed-orders-user06-4",
      "seed-orders-user06-5",
      // user07
      "seed-orders-user07-1",
      "seed-orders-user07-2",
      "seed-orders-user07-3",
      "seed-orders-user07-4",
      "seed-orders-user07-5",
      // user08
      "seed-orders-user08-1",
      "seed-orders-user08-2",
      "seed-orders-user08-3",
      "seed-orders-user08-4",
      "seed-orders-user08-5",
      // user09
      "seed-orders-user09-1",
      "seed-orders-user09-2",
      "seed-orders-user09-3",
      "seed-orders-user09-4",
      "seed-orders-user09-5",
      // user10
      "seed-orders-user10-1",
      "seed-orders-user10-2",
      "seed-orders-user10-3",
      "seed-orders-user10-4",
      "seed-orders-user10-5",
    ];

    // quantity pattern and offsets
    const quantities = [1, 2, 1, 1, 3];

    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user01-1' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 0),
        1,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 0),
        1 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 0),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user01-1' LIMIT 1)
      )
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user01-2' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 1),
        2,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 1),
        2 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 1),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user01-2' LIMIT 1)
      )
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user01-3' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 2),
        1,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 2),
        1 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 2),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user01-3' LIMIT 1)
      )
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user01-4' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 3),
        1,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 3),
        1 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 3),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user01-4' LIMIT 1)
      )
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user01-5' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 4),
        3,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 4),
        3 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 4),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user01-5' LIMIT 1)
      )
    `);

    // user02
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user02-1' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 0),
        1,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 0),
        1 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 0),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user02-1' LIMIT 1)
      )
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user02-2' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 1),
        2,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 1),
        2 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 1),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user02-2' LIMIT 1)
      )
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user02-3' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 2),
        1,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 2),
        1 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 2),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user02-3' LIMIT 1)
      )
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user02-4' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 3),
        1,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 3),
        1 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 3),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user02-4' LIMIT 1)
      )
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user02-5' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 4),
        3,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 4),
        3 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 4),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user02-5' LIMIT 1)
      )
    `);

    // user03
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user03-1' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 0),
        1,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 0),
        1 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 0),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user03-1' LIMIT 1)
      )
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user03-2' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 1),
        2,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 1),
        2 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 1),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user03-2' LIMIT 1)
      )
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user03-3' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 2),
        1,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 2),
        1 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 2),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user03-3' LIMIT 1)
      )
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user03-4' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 3),
        1,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 3),
        1 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 3),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user03-4' LIMIT 1)
      )
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user03-5' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 4),
        3,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 4),
        3 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 4),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user03-5' LIMIT 1)
      )
    `);

    // user04
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user04-1' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 0),
        1,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 0),
        1 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 0),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user04-1' LIMIT 1)
      )
    `);

    // user04 remaining
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user04-2' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 1),
        2,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 1),
        2 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 1),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user04-2' LIMIT 1)
      )
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user04-3' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 2),
        1,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 2),
        1 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 2),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user04-3' LIMIT 1)
      )
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user04-4' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 3),
        1,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 3),
        1 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 3),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user04-4' LIMIT 1)
      )
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user04-5' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 4),
        3,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 4),
        3 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 4),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user04-5' LIMIT 1)
      )
    `);

    // user05
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user05-1' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 0),
        1,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 0),
        1 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 0),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user05-1' LIMIT 1)
      )
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user05-2' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 1),
        2,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 1),
        2 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 1),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user05-2' LIMIT 1)
      )
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user05-3' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 2),
        1,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 2),
        1 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 2),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user05-3' LIMIT 1)
      )
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user05-4' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 3),
        1,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 3),
        1 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 3),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user05-4' LIMIT 1)
      )
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user05-5' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 4),
        3,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 4),
        3 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 4),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user05-5' LIMIT 1)
      )
    `);

    // user06
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user06-1' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 0),
        1,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 0),
        1 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 0),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user06-1' LIMIT 1)
      )
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user06-2' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 1),
        2,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 1),
        2 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 1),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user06-2' LIMIT 1)
      )
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user06-3' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 2),
        1,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 2),
        1 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 2),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user06-3' LIMIT 1)
      )
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user06-4' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 3),
        1,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 3),
        1 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 3),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user06-4' LIMIT 1)
      )
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user06-5' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 4),
        3,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 4),
        3 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 4),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user06-5' LIMIT 1)
      )
    `);

    // user07
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user07-1' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 0),
        1,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 0),
        1 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 0),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user07-1' LIMIT 1)
      )
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user07-2' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 1),
        2,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 1),
        2 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 1),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user07-2' LIMIT 1)
      )
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user07-3' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 2),
        1,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 2),
        1 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 2),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user07-3' LIMIT 1)
      )
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user07-4' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 3),
        1,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 3),
        1 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 3),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user07-4' LIMIT 1)
      )
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user07-5' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 4),
        3,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 4),
        3 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 4),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user07-5' LIMIT 1)
      )
    `);

    // user08
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user08-1' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 0),
        1,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 0),
        1 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 0),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user08-1' LIMIT 1)
      )
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user08-2' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 1),
        2,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 1),
        2 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 1),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user08-2' LIMIT 1)
      )
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user08-3' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 2),
        1,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 2),
        1 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 2),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user08-3' LIMIT 1)
      )
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user08-4' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 3),
        1,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 3),
        1 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 3),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user08-4' LIMIT 1)
      )
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user08-5' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 4),
        3,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 4),
        3 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 4),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user08-5' LIMIT 1)
      )
    `);

    // user09
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user09-1' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 0),
        1,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 0),
        1 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 0),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user09-1' LIMIT 1)
      )
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user09-2' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 1),
        2,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 1),
        2 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 1),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user09-2' LIMIT 1)
      )
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user09-3' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 2),
        1,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 2),
        1 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 2),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user09-3' LIMIT 1)
      )
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user09-4' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 3),
        1,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 3),
        1 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 3),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user09-4' LIMIT 1)
      )
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user09-5' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 4),
        3,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 4),
        3 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 4),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user09-5' LIMIT 1)
      )
    `);

    // user10
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user10-1' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 0),
        1,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 0),
        1 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 0),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user10-1' LIMIT 1)
      )
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user10-2' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 1),
        2,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 1),
        2 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 1),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user10-2' LIMIT 1)
      )
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user10-3' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 2),
        1,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 2),
        1 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 2),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user10-3' LIMIT 1)
      )
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user10-4' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 3),
        1,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 3),
        1 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 3),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user10-4' LIMIT 1)
      )
    `);
    await queryInterface.sequelize.query(`
      INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal, created_at)
      VALUES (
        (SELECT order_id FROM orders WHERE note = 'seed-orders-user10-5' LIMIT 1),
        (SELECT product_id FROM products ORDER BY product_id LIMIT 1 OFFSET 4),
        3,
        (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 4),
        3 * (SELECT price FROM products ORDER BY product_id LIMIT 1 OFFSET 4),
        (SELECT created_at FROM orders WHERE note = 'seed-orders-user10-5' LIMIT 1)
      )
    `);
  },

  async down(queryInterface, Sequelize) {
    // delete items first
    await queryInterface.sequelize.query(
      `DELETE oi FROM order_items oi WHERE oi.order_id IN (SELECT order_id FROM orders WHERE note LIKE 'seed-orders-%')`
    );
    await queryInterface.sequelize.query(
      `DELETE FROM orders WHERE note LIKE 'seed-orders-%'`
    );
  },
};
