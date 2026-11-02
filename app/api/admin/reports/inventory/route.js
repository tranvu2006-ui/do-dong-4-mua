import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// API 74: Báo cáo hàng tồn kho 4 mùa
export async function GET() {
  try {
    // 1. Tồn kho gom nhóm theo danh mục
    const categoryStock = await query(`
      SELECT c.id as category_id, c.name as category_name,
             COUNT(p.id) as total_products,
             COALESCE(SUM(p.stock), 0) as total_stock,
             COALESCE(SUM(p.stock * p.price), 0) as inventory_value
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id
      GROUP BY c.id, c.name
    `);

    // 2. Danh sách sản phẩm sắp hết hàng (stock <= 10)
    const lowStockAlerts = await query(`
      SELECT p.id, p.name, p.unit, p.stock, p.price, p.thumbnail, c.name as category_name
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.stock <= 10
      ORDER BY p.stock ASC
    `);

    return NextResponse.json({
      success: true,
      data: {
        categoryStock,
        lowStockAlerts
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

