import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

const DEFAULT_TIERS = [
  { name: 'Nội thành gần (Dưới 5 km)', min_km: 0, max_km: 5, fee: 15000, status: 1 },
  { name: 'Tiêu chuẩn nội thành (5 - 10 km)', min_km: 5, max_km: 10, fee: 25000, status: 1 },
  { name: 'Nội thành xa (10 - 20 km)', min_km: 10, max_km: 20, fee: 40000, status: 1 },
  { name: 'Ngoại thành / Liên quận (Trên 20 km)', min_km: 20, max_km: 50, fee: 60000, status: 1 },
];

async function ensureShippingFeesTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS shipping_fees (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL COMMENT 'Tên gói/nấc cước',
      min_km DECIMAL(6,2) NOT NULL DEFAULT 0.00 COMMENT 'Khoảng cách từ (km)',
      max_km DECIMAL(6,2) NOT NULL DEFAULT 0.00 COMMENT 'Khoảng cách đến (km)',
      fee DECIMAL(12,2) NOT NULL DEFAULT 0.00 COMMENT 'Mức phí vận chuyển (VNĐ)',
      status TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1: Áp dụng, 0: Tạm dừng',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  const rows = await query('SELECT COUNT(*) as count FROM shipping_fees');
  if (rows[0]?.count === 0) {
    for (const tier of DEFAULT_TIERS) {
      await query(
        `INSERT INTO shipping_fees (name, min_km, max_km, fee, status) VALUES (?, ?, ?, ?, ?)`,
        [tier.name, tier.min_km, tier.max_km, tier.fee, tier.status]
      );
    }
  }
}

export async function GET(request) {
  try {
    await ensureShippingFeesTable();
    const { searchParams } = new URL(request.url);
    const onlyActive = searchParams.get('active') === 'true';

    const sql = onlyActive
      ? `SELECT * FROM shipping_fees WHERE status = 1 ORDER BY min_km ASC, id ASC`
      : `SELECT * FROM shipping_fees ORDER BY min_km ASC, id ASC`;

    const fees = await query(sql);
    return NextResponse.json({ success: true, data: fees });
  } catch (error) {
    console.error('Error fetching shipping fees:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await ensureShippingFeesTable();
    const { name, min_km, max_km, fee, status } = await request.json();

    if (!name || name.trim() === '') {
      return NextResponse.json({ success: false, message: 'Vui lòng nhập tên gói cước vận chuyển!' }, { status: 400 });
    }

    const minKmNum = parseFloat(min_km);
    const maxKmNum = parseFloat(max_km);
    const feeNum = parseFloat(fee);

    if (isNaN(minKmNum) || isNaN(maxKmNum) || minKmNum < 0 || maxKmNum <= minKmNum) {
      return NextResponse.json({ success: false, message: 'Khoảng cách không hợp lệ! Khoảng cách đến phải lớn hơn khoảng cách từ (km >= 0).' }, { status: 400 });
    }

    if (isNaN(feeNum) || feeNum < 0) {
      return NextResponse.json({ success: false, message: 'Mức phí vận chuyển phải lớn hơn hoặc bằng 0 đ!' }, { status: 400 });
    }

    const result = await query(
      `INSERT INTO shipping_fees (name, min_km, max_km, fee, status) VALUES (?, ?, ?, ?, ?)`,
      [name.trim(), minKmNum, maxKmNum, feeNum, status !== undefined ? Number(status) : 1]
    );

    await query(
      `INSERT INTO system_logs (user_id, action, module, description)
       VALUES (1, 'CREATE_SHIPPING_FEE', 'SYSTEM', ?)`,
      [`Admin Tổng thêm nấc cước vận chuyển: ${name.trim()} (${minKmNum}km - ${maxKmNum}km: ${feeNum.toLocaleString('vi-VN')} đ)`]
    );

    return NextResponse.json({
      success: true,
      message: 'Thêm nấc phí vận chuyển thành công!',
      id: result.insertId
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding shipping fee:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

