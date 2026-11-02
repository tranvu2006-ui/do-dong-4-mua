import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

if (!global.__siteSettings) {
  global.__siteSettings = {
    site_name: 'Đổ Đống 4 Mùa',
    hotline: '0901.234.567',
    contact_email: 'hotro@dodong4mua.vn',
    headquarters: '53 Võ Văn Ngân, P. Linh Chiểu, TP. Thủ Đức, TP.HCM',
    default_shipping_fee: 25000,
    freeship_threshold: 500000,
    shipping_partner: 'GreenSM',
    exchange_policy: 'Bao ăn 1 đổi 1 trong 24 giờ'
  };
}

// API 78: Lấy danh sách cấu hình hệ thống
export async function GET() {
  return NextResponse.json({
    success: true,
    data: global.__siteSettings
  });
}

// API 79: Cập nhật cấu hình hệ thống
export async function PUT(request) {
  try {
    const body = await request.json();
    global.__siteSettings = { ...global.__siteSettings, ...body };

    await query(
      `INSERT INTO system_logs (user_id, action, module, description)
       VALUES (1, 'UPDATE_SETTINGS', 'SYSTEM', 'Cập nhật thông số cấu hình hệ thống website')`
    );

    return NextResponse.json({
      success: true,
      message: 'Cập nhật cấu hình website thành công!',
      data: global.__siteSettings
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

