import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// API 71: Báo cáo doanh thu chi tiết
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branch_id');

    // 1. Doanh thu theo tháng
    const monthlyRevenue = await query(`
      SELECT DATE_FORMAT(created_at, '%Y-%m') as month,
             COUNT(id) as total_orders,
             COALESCE(SUM(total_amount), 0) as total_revenue
      FROM orders
      WHERE payment_status = 'DA_THANH_TOAN'
      GROUP BY DATE_FORMAT(created_at, '%Y-%m')
      ORDER BY month DESC
      LIMIT 12
    `);

    // 2. Doanh thu theo phương thức thanh toán
    const revenueByPayment = await query(`
      SELECT p.payment_method,
             COUNT(p.id) as trans_count,
             COALESCE(SUM(p.amount), 0) as total_amount
      FROM payments p
      WHERE p.status = 'DA_THANH_TOAN'
      GROUP BY p.payment_method
    `);

    // 3. Top sản phẩm bán chạy nhất
    const topProducts = await query(`
      SELECT p.id, p.name, p.thumbnail, p.price,
             SUM(od.quantity) as total_sold,
             SUM(od.total_price) as total_revenue
      FROM order_details od
      JOIN products p ON od.product_id = p.id
      JOIN orders o ON od.order_id = o.id
      WHERE o.payment_status = 'DA_THANH_TOAN'
      GROUP BY p.id, p.name, p.thumbnail, p.price
      ORDER BY total_sold DESC
      LIMIT 5
    `);

    return NextResponse.json({
      success: true,
      data: {
        monthlyRevenue,
        revenueByPayment,
        topProducts
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

