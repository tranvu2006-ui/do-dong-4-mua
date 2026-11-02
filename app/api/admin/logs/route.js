import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const logs = await query(`
      SELECT l.*, COALESCE(u.full_name, 'Khách vãng lai / Hệ thống') as user_name, u.phone
      FROM system_logs l
      LEFT JOIN users u ON l.user_id = u.id
      ORDER BY l.id DESC
      LIMIT ?
    `, [limit]);

    return NextResponse.json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    console.error('Error fetching system logs:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

