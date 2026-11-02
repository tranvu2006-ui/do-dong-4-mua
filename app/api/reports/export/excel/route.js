import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const orders = await query('SELECT order_code, receiver_name, phone, address, total_amount, order_status, created_at FROM orders ORDER BY id DESC LIMIT 50');
    let csv = 'Mã Đơn,Người Nhận,Số Điện Thoại,Địa Chỉ,Tổng Tiền,Trạng Thái,Ngày Đặt\n';
    orders.forEach(o => {
      csv += `"${o.order_code}","${o.receiver_name}","${o.phone}","${o.address}",${o.total_amount},"${o.order_status}","${o.created_at}"\n`;
    });
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename=orders_report.csv'
      }
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
