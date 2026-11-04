import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role'); // 'customer' or 'admin'

    let sql = `SELECT id, title, content, recipient_type, created_at FROM notifications WHERE 1=1`;
    const params = [];

    if (role === 'customer') {
      sql += ` AND (recipient_type = 'ALL' OR recipient_type = 'CUSTOMERS')`;
    } else if (role === 'admin') {
      sql += ` AND (recipient_type = 'ALL' OR recipient_type = 'ADMINS')`;
    }

    sql += ` ORDER BY created_at DESC LIMIT 50`;

    const notifications = await query(sql, params);
    return NextResponse.json({ success: true, data: notifications });
  } catch (error) {
    console.error('Error fetching public notifications:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

