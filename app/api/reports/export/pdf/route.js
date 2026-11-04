import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { generatePdfReport } from '@/lib/pdf-report-generator';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'revenue';
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';
    const status = searchParams.get('status') || '';

    // Lấy thông tin cấu hình cửa hàng
    const settingsRows = await query('SELECT setting_key, setting_value FROM system_settings');
    const settings = {};
    if (Array.isArray(settingsRows)) {
      settingsRows.forEach(r => {
        settings[r.setting_key] = r.setting_value;
      });
    }

    // Xây dựng điều kiện lọc đơn hàng
    let sql = 'SELECT id, order_code, receiver_name, phone, address, total_amount, order_status, created_at FROM orders WHERE 1=1';
    const params = [];

    if (startDate) {
      sql += ' AND created_at >= ?';
      params.push(`${startDate} 00:00:00`);
    }
    if (endDate) {
      sql += ' AND created_at <= ?';
      params.push(`${endDate} 23:59:59`);
    }
    if (status && status !== 'ALL') {
      sql += ' AND order_status = ?';
      params.push(status);
    }

    sql += ' ORDER BY id DESC LIMIT 200';

    const orders = await query(sql, params);

    // Tính toán số liệu thống kê tổng hợp (KPI Summary)
    const totalOrders = orders.length;
    let completedOrders = 0;
    let totalRevenue = 0;

    orders.forEach(o => {
      const amt = Number(o.total_amount) || 0;
      if (['COMPLETED', 'DELIVERED'].includes(o.order_status)) {
        completedOrders += 1;
        totalRevenue += amt;
      }
    });

    const averageOrderValue = completedOrders > 0 ? Math.round(totalRevenue / completedOrders) : 0;

    const reportTitle = type === 'orders'
      ? 'BÁO CÁO TỔNG HỢP DANH SÁCH ĐƠN HÀNG'
      : 'BÁO CÁO DOANH THU & ĐỐI SOÁT ĐƠN HÀNG';

    const pdfBytes = await generatePdfReport({
      title: reportTitle,
      reportType: type,
      startDate,
      endDate,
      summary: {
        totalRevenue,
        totalOrders,
        completedOrders,
        averageOrderValue
      },
      orders,
      settings
    });

    const filename = type === 'orders'
      ? `Bao_Cao_Don_Hang_${new Date().toISOString().slice(0, 10)}.pdf`
      : `Bao_Cao_Doanh_Thu_${new Date().toISOString().slice(0, 10)}.pdf`;

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (err) {
    console.error('Error generating PDF report:', err);
    return NextResponse.json({ success: false, message: 'Lỗi khi tạo báo cáo PDF: ' + err.message }, { status: 500 });
  }
}
