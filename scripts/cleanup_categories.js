const mysql = require('mysql2/promise');

(async () => {
  const conn = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'do_dong_4_mua'
  });

  // 1. Delete test product 's'
  await conn.query('DELETE FROM products WHERE id = 3');

  // 2. Standardize Category 1: Trái cây tươi
  await conn.query(
    'UPDATE categories SET name = ?, slug = ?, description = ?, status = 1 WHERE id = 1',
    ['Trái cây tươi', 'trai-cay-tuoi', 'Các loại trái cây tươi ngon theo mùa vụ, đạt chuẩn VietGAP và nhập khẩu cao cấp.']
  );

  // 3. Standardize Category 2: Combo trái cây
  await conn.query(
    'UPDATE categories SET name = ?, slug = ?, description = ?, status = 1 WHERE id = 2',
    ['Combo trái cây', 'combo-trai-cay', 'Gói kết hợp nhiều loại trái cây ăn gia đình, văn phòng với giá ưu đãi.']
  );

  // 4. Standardize Category 4: Giỏ quà trái cây
  await conn.query(
    'UPDATE categories SET name = ?, slug = ?, description = ?, status = 1 WHERE id = 4',
    ['Giỏ quà trái cây', 'gio-qua-trai-cay', 'Giỏ quà biếu tặng sang trọng, thiết kế theo mẫu cố định chuẩn chất lượng cao.']
  );

  // 5. Delete empty duplicate categories 5..16
  await conn.query('DELETE FROM categories WHERE id IN (5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16)');

  // 6. Add sample products for Combo and Giỏ quà if not exists
  const [comboExists] = await conn.query('SELECT id FROM products WHERE category_id = 2 LIMIT 1');
  if (comboExists.length === 0) {
    await conn.query(
      `INSERT INTO products (name, slug, category_id, price, discount_price, unit, stock, description, is_featured, status)
       VALUES (?, ?, 2, 199000, 179000, 'combo', 35, 'Gói kết hợp 3 loại quả: 1kg Xoài Cát Hòa Lộc, 1kg Táo Envy, 500g Nho đen không hạt.', 1, 1)`,
      ['Combo Trái Cây Thanh Nhiệt 3 Món', 'combo-trai-cay-thanh-nhiet-3-mon']
    );
  }

  const [giftExists] = await conn.query('SELECT id FROM products WHERE category_id = 4 LIMIT 1');
  if (giftExists.length === 0) {
    await conn.query(
      `INSERT INTO products (name, slug, category_id, price, discount_price, unit, stock, description, is_featured, status)
       VALUES (?, ?, 4, 550000, 499000, 'giỏ', 20, 'Mẫu giỏ quà sang trọng cố định: 1 Dưa lưới Huỳnh Long, 2 Táo Envy, 1 Chùm Nho Mẫu Đơn, kèm ruy băng cao cấp.', 1, 1)`,
      ['Giỏ Quà Trái Cây Tài Lộc Mẫu 01', 'gio-qua-trai-cay-tai-loc-mau-01']
    );
  }

  // 7. Add one out-of-stock product to test BR-004 / FR-012
  const [outOfStock] = await conn.query('SELECT id FROM products WHERE stock = 0 LIMIT 1');
  if (outOfStock.length === 0) {
    await conn.query(
      `INSERT INTO products (name, slug, category_id, price, discount_price, unit, stock, description, is_featured, status)
       VALUES (?, ?, 1, 140000, NULL, 'kg', 0, 'Sầu riêng Ri6 cơm vàng hạt lép Cai Lậy, đang tạm hết hàng mùa vụ.', 0, 1)`,
      ['Sầu Riêng Ri6 Cai Lậy (Tạm hết hàng)', 'sau-rieng-ri6-cai-lay']
    );
  }

  const [cats] = await conn.query('SELECT c.id, c.name, c.slug, c.status, COUNT(p.id) as product_count FROM categories c LEFT JOIN products p ON c.id = p.category_id GROUP BY c.id');
  console.log('Categories after cleanup:');
  console.table(cats);

  await conn.end();
})();

