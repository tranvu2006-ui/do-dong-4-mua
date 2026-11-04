import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { logSystemAction } from '@/lib/logger';

const DEFAULT_SETTINGS = {
  site_name: '',
  logo_url: '',
  hotline: '',
  contact_email: '',
  company_address: '',
  default_shipping_fee: '25000',
  freeship_threshold: '500000',
  shipping_partner: 'GreenSM',
  exchange_policy: '',
  shipping_policy: '',
  privacy_policy: '',
  terms_of_service: ''
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
      description: 'Admin Tổng cập nhật thông số cấu hình hệ thống website'
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
