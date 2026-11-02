import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const stats = await query('SELECT COUNT(*) as total_orders, COALESCE(SUM(total_amount), 0) as total_revenue FROM orders');
    return NextResponse.json({
      success: true,
      message: 'Báo cáo tổng kết PDF/JSON',
      exported_at: new Date().toISOString(),
      summary: stats[0]
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
