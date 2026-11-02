import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// API 75 & API 76: Xuất dữ liệu báo cáo (Excel / PDF / JSON Export)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json'; // 'excel', 'pdf', 'json'

    const revenue = await query(`
      SELECT DATE_FORMAT(created_at, '%Y-%m-%d') as date,
             COUNT(id) as total_orders,
             COALESCE(SUM(total_amount), 0) as revenue
      FROM orders
      WHERE payment_status = 'DA_THANH_TOAN'
      GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')
      ORDER BY date DESC
      LIMIT 30
    `);

    const products = await query(`
      SELECT p.id, p.name, c.name as category_name, p.price, p.stock
      FROM products p
      JOIN categories c ON p.category_id = c.id
      ORDER BY p.id ASC
    `);

    if (format === 'excel' || format === 'csv') {
      let csv = 'Ngay,SoDonHang,DoanhThu\n';
      revenue.forEach(r => {
        csv += `${r.date},${r.total_orders},${r.revenue}\n`;
      });
      return new Response(csv, {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': 'attachment; filename="Bao_Cao_Doanh_Thu_Do_Dong_4_Mua.csv"'
        }
      });
    }

    return NextResponse.json({
      success: true,
      export_format: format,
      generated_at: new Date().toISOString(),
      data: {
        revenue_summary: revenue,
        inventory_summary: products
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

