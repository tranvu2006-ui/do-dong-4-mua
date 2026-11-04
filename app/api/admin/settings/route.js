import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { logSystemAction } from '@/lib/logger';

const DEFAULT_SETTINGS = {
  site_name: 'Đổ Đống 4 Mùa - Nông Sản Trái Cây Tươi Ngon',
  logo_url: '/logo.png',
  hotline: '0901.234.567',
  contact_email: 'hotro@dodong4mua.vn',
  company_address: '53 Võ Văn Ngân, Phường Linh Chiểu, TP. Thủ Đức, TP. Hồ Chí Minh',
  default_shipping_fee: '25000',
  freeship_threshold: '500000',
  shipping_partner: 'GreenSM',
  exchange_policy: 'Chính sách bao ăn 1 đổi 1 trong vòng 24 giờ kể từ khi nhận hàng nếu trái cây có dấu hiệu sâu hỏng, dập nát, chua gắt hoặc không đúng cam kết chất lượng. Quý khách vui lòng chụp ảnh hoặc quay video gửi hotline để được đổi trái cây mới ngay lập tức.',
  shipping_policy: 'Giao hàng siêu tốc trong vòng 2 giờ nội thành TP.HCM qua đối tác GreenSM. Miễn phí vận chuyển cho toàn bộ đơn hàng từ 500.000đ trong bán kính 10km. Trái cây được đóng thùng carton chuyên dụng có lót xốp lưới chống dập nát.',
  privacy_policy: 'Đổ Đống 4 Mùa cam kết bảo mật 100% dữ liệu cá nhân, số điện thoại và địa chỉ giao hàng của quý khách. Thông tin chỉ được sử dụng cho mục đích liên hệ xử lý đơn hàng và không bao giờ chia sẻ cho bất kỳ bên thứ ba nào.',
  terms_of_service: 'Khách hàng có quyền đồng kiểm tra hàng cùng shipper GreenSM trước khi thanh toán. Mọi đơn hàng đều có thể thanh toán trực tuyến qua VietQR hoặc thanh toán tiền mặt khi nhận hàng (COD).'
};

async function ensureTableAndGetSettings() {
  await query(`
    CREATE TABLE IF NOT EXISTS system_settings (
      setting_key VARCHAR(100) PRIMARY KEY,
      setting_value TEXT,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  const rows = await query('SELECT setting_key, setting_value FROM system_settings');
  const settingsMap = {};
  rows.forEach((r) => {
    settingsMap[r.setting_key] = r.setting_value;
  });

  // Seed missing defaults
  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    if (settingsMap[key] === undefined) {
      await query(
        'INSERT INTO system_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)',
        [key, String(value)]
      );
      settingsMap[key] = String(value);
    }
  }

  return settingsMap;
}

export async function GET() {
  try {
    const settings = await ensureTableAndGetSettings();
    return NextResponse.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    await ensureTableAndGetSettings();

    for (const [key, value] of Object.entries(body)) {
      if (typeof key === 'string' && key.trim()) {
        await query(
          'INSERT INTO system_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)',
          [key.trim(), value !== null && value !== undefined ? String(value).trim() : '']
        );
      }
    }

        await logSystemAction({
      request,
      userId: 1,
      action: 'UPDATE_SETTINGS',
      module: 'SYSTEM',
      description: 'Admin Tổng cập nhật thông số cấu hình hệ thống website (FR-043)'
    });

    const updated = await ensureTableAndGetSettings();

    return NextResponse.json({
      success: true,
      message: 'Cập nhật cấu hình website thành công!',
      data: updated
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
