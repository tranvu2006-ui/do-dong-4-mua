import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { code } = await params;

    const orders = await query(
      `SELECT o.*, 
              p.payment_method, p.status as payment_detail_status, p.transaction_code, p.payment_time,
              s.shipping_company, s.tracking_code, s.shipping_status, s.ship_date, s.delivery_date
       FROM orders o
       LEFT JOIN payments p ON p.order_id = o.id
       LEFT JOIN shipments s ON s.order_id = o.id
       WHERE o.order_code = ? OR o.id = ?
       LIMIT 1`,
      [code, code]
    );

    if (!orders || orders.length === 0) {
      return NextResponse.json({ success: false, message: 'Không tìm thấy đơn hàng' }, { status: 404 });
    }

    const order = orders[0];

    const items = await query(
      `SELECT od.*, p.name as product_name, p.slug as product_slug, p.thumbnail, p.unit
       FROM order_details od
       JOIN products p ON od.product_id = p.id
       WHERE od.order_id = ?`,
      [order.id]
    );

    order.items = items;

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error('Error fetching order detail:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { code } = await params;
    const body = await request.json();
    const { order_status, shipping_status, payment_status, reason, action } = body;

    // Get order ID and current status
    const orders = await query('SELECT * FROM orders WHERE order_code = ? OR id = ?', [code, code]);
    if (!orders.length) {
      return NextResponse.json({ success: false, message: 'Đơn hàng không tồn tại' }, { status: 404 });
    }
    const currentOrder = orders[0];
    const orderId = currentOrder.id;

    // Xử lý HỦY ĐƠN HÀNG (FR-028 & BR-020)
    if (action === 'CANCEL' || order_status === 'DA_HUY') {
      if (currentOrder.order_status !== 'CHO_XAC_NHAN' && currentOrder.order_status !== 'CHO_THANH_TOAN') {
        return NextResponse.json({
          success: false,
          message: `Không thể hủy đơn hàng vì đơn đã chuyển sang trạng thái "${currentOrder.order_status}". Vui lòng liên hệ Hotline 0901.234.567 để được hỗ trợ!`
        }, { status: 400 });
      }

      // Hoàn lại số lượng tồn kho sản phẩm (BR-020)
      const details = await query('SELECT product_id, quantity FROM order_details WHERE order_id = ?', [orderId]);
      for (const d of details) {
        await query('UPDATE products SET stock = stock + ? WHERE id = ?', [d.quantity, d.product_id]);
      }

      // Cập nhật trạng thái hủy
      await query('UPDATE orders SET order_status = "DA_HUY" WHERE id = ?', [orderId]);
      await query('UPDATE shipments SET shipping_status = "GIAO_THAT_BAI" WHERE order_id = ?', [orderId]);

      // Ghi audit log
      await query(
        `INSERT INTO system_logs (user_id, action, module, description)
         VALUES (?, 'CANCEL', 'ORDER', ?)`,
        [currentOrder.user_id, `Hủy đơn hàng mã ${currentOrder.order_code}. Lý do: ${reason || 'Khách hàng yêu cầu hủy'}`]
      );

      return NextResponse.json({ success: true, message: 'Hủy đơn hàng thành công, tồn kho sản phẩm đã được hoàn lại!' });
    }

    // Cập nhật trạng thái thông thường (Admin)
    if (order_status) {
      await query('UPDATE orders SET order_status = ? WHERE id = ?', [order_status, orderId]);
    }

    if (payment_status) {
      await query('UPDATE orders SET payment_status = ? WHERE id = ?', [payment_status, orderId]);
      await query('UPDATE payments SET payment_status = ?, status = ? WHERE order_id = ?', [payment_status, payment_status === 'PAID' ? 'PAID' : 'PENDING', orderId]);
    }

    if (shipping_status) {
      let shipDate = null;
      let deliveryDate = null;
      if (shipping_status === 'DA_BAN_GIAO_GREENSM' || shipping_status === 'DANG_GIAO') {
        shipDate = new Date();
      }
      if (shipping_status === 'GIAO_THANH_CONG') {
        deliveryDate = new Date();
      }

      await query(
        `UPDATE shipments 
         SET shipping_status = ?,
             ship_date = COALESCE(?, ship_date),
             delivery_date = COALESCE(?, delivery_date)
         WHERE order_id = ?`,
        [shipping_status, shipDate, deliveryDate, orderId]
      );
    }

    // Ghi audit log thay đổi trạng thái
    await query(
      `INSERT INTO system_logs (user_id, action, module, description)
       VALUES (?, 'UPDATE_STATUS', 'ORDER', ?)`,
      [1, `Cập nhật đơn hàng ${currentOrder.order_code} sang trạng thái: ${order_status || currentOrder.order_status}`]
    );

    return NextResponse.json({ success: true, message: 'Cập nhật trạng thái đơn hàng thành công' });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export { PATCH as PUT };

