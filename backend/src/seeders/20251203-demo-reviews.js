module.exports = {
  async up(queryInterface, Sequelize) {
    // review #1 (user offset 0) - User 1, 5 stars
    await queryInterface.sequelize.query(`
      INSERT INTO reviews (product_id, user_id, rating, comment, status, created_at, updated_at)
      SELECT p.product_id,
             (SELECT u.user_id FROM users u WHERE u.role <> 'admin' ORDER BY u.user_id LIMIT 1 OFFSET 0),
             5,
               CASE MOD(p.product_id, 5)
                 WHEN 0 THEN 'Sản phẩm rất tốt, chất lượng vượt mong đợi.'
                 WHEN 1 THEN 'Chất liệu đẹp, cầm chắc tay, giá xứng đáng.'
                 WHEN 2 THEN 'Giao hàng nhanh, đóng gói cẩn thận, rất ưng.'
                 WHEN 3 THEN 'Form chuẩn, mặc ôm vừa, sẽ ủng hộ thêm.'
                 ELSE 'Màu sắc như hình, chất vải mịn, đáng tiền.'
               END,
               
             'approved',
             '2025-02-12 10:00:00',
             '2025-02-12 10:00:00'
      FROM products p
      WHERE p.active = 1;
    `);

    // review #2 (user offset 1) - User 2, 4 stars
    await queryInterface.sequelize.query(`
      INSERT INTO reviews (product_id, user_id, rating, comment, status, created_at, updated_at)
      SELECT p.product_id,
             (SELECT u.user_id FROM users u WHERE u.role <> 'admin' ORDER BY u.user_id LIMIT 1 OFFSET 1),
             4,
               CASE MOD(p.product_id, 5)
                 WHEN 0 THEN 'Sản phẩm ổn, vừa vặn và dễ phối đồ.'
                 WHEN 1 THEN 'Chi tiết may đẹp, may chắc, sẽ mua thêm.'
                 WHEN 2 THEN 'Màu tươi, giữ form sau vài lần giặt.'
                 WHEN 3 THEN 'Phù hợp giá tiền, nhân viên tư vấn nhiệt tình.'
                 ELSE 'OK cho giá này, giao nhanh, đóng gói tốt.'
               END,
               
             'approved',
             '2025-02-12 11:00:00',
             '2025-02-12 11:00:00'
      FROM products p
      WHERE p.active = 1;
    `);

    // review #3 (user offset 2) - User 3, 3 stars
    await queryInterface.sequelize.query(`
      INSERT INTO reviews (product_id, user_id, rating, comment, status, created_at, updated_at)
      SELECT p.product_id,
             (SELECT u.user_id FROM users u WHERE u.role <> 'admin' ORDER BY u.user_id LIMIT 1 OFFSET 2),
             3,
               CASE MOD(p.product_id, 5)
                 WHEN 0 THEN 'Tạm ổn, nhưng có vài chỗ chưa hài lòng nhỏ.'
                 WHEN 1 THEN 'Chất lượng trung bình, phù hợp nhu cầu hàng ngày.'
                 WHEN 2 THEN 'Giá tốt, phù hợp với ai thích phong cách đơn giản.'
                 WHEN 3 THEN 'Vải hơi mỏng nhưng vẫn chấp nhận được.'
                 ELSE 'Sử dụng được, sẽ cân nhắc mua thêm màu khác.'
               END,
              
             'approved',
             '2025-02-12 12:00:00',
             '2025-02-12 12:00:00'
      FROM products p
      WHERE p.active = 1;
    `);
  },

  async down(queryInterface, Sequelize) {
    // delete seeded reviews by comment tag
    await queryInterface.sequelize.query(`
      DELETE FROM reviews WHERE comment LIKE '%seed-review-%';
    `);
  },
};
