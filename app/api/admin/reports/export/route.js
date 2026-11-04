import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { generatePdfReport } from '@/lib/pdf-report-generator';

// API 75 & API 76: Xuất dữ liệu báo cáo (Excel / PDF / JSON Export)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json'; // 'excel', 'pdf', 'json'
    const type = searchParams.get('type') || 'revenue';
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';

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

    // API 75: Xuất file Excel / CSV
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

    // API 76: Xuất file PDF thực tế
    if (format === 'pdf') {
      const orders = await query('SELECT id, order_code, receiver_name, phone, address, total_amount, order_status, created_at FROM orders ORDER BY id DESC LIMIT 100');
      const settingsRows = await query('SELECT setting_key, setting_value FROM system_settings');
      const settings = {};
      if (Array.isArray(settingsRows)) {
        settingsRows.forEach(r => { settings[r.setting_key] = r.setting_value; });
      }

      let totalRevenue = 0;
      let completedOrders = 0;
      orders.forEach(o => {
        const amt = Number(o.total_amount) || 0;
        if (['COMPLETED', 'DELIVERED'].includes(o.order_status)) {
          completedOrders++;
          totalRevenue += amt;
        }
      });

      const pdfBytes = await generatePdfReport({
        title: type === 'orders' ? 'BÁO CÁO TỔNG HỢP DANH SÁCH ĐƠN HÀNG' : 'BÁO CÁO DOANH THU & ĐỐI SOÁT ĐƠN HÀNG',
        reportType: type,
        startDate,
        endDate,
        summary: {
          totalRevenue,
          totalOrders: orders.length,
          completedOrders,
          averageOrderValue: completedOrders > 0 ? Math.round(totalRevenue / completedOrders) : 0
        },
        orders,
        settings
      });

      return new NextResponse(Buffer.from(pdfBytes), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="Bao_Cao_${type}_${new Date().toISOString().slice(0, 10)}.pdf"`,
          'Cache-Control': 'no-store, max-age=0'
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
