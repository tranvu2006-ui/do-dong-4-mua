import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// API 72: Báo cáo thống kê đơn hàng
export async function GET() {
  try {
    const statusCounts = await query(`
      SELECT order_status, COUNT(id) as count, COALESCE(SUM(total_amount), 0) as total_value
      FROM orders
      GROUP BY order_status
    `);

    const recentOrders = await query(`
      SELECT o.*, p.payment_method, p.status as payment_detail_status
      FROM orders o
      LEFT JOIN payments p ON p.order_id = o.id
      ORDER BY o.id DESC
      LIMIT 10
    `);

    return NextResponse.json({
      success: true,
      data: {
        statusCounts,
        recentOrders
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

