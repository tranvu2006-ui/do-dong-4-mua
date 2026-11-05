import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { ensureBranchInventoriesTable } from '@/lib/inventory';

/**
 * FR-049: Báo cáo hàng tồn kho (Inventory Report)
 * Hỗ trợ lọc theo từng Chi nhánh (Branch-Level Inventory) và Toàn hệ thống
 */

export async function GET(request) {
  try {
    await ensureBranchInventoriesTable();

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const search = searchParams.get('search')?.trim();
    const categoryId = searchParams.get('categoryId');
    const branchId = searchParams.get('branchId') || 'all';
    const stockStatus = searchParams.get('stockStatus'); // 'all' | 'out_of_stock' | 'low_stock' | 'in_stock'
    const format = searchParams.get('format'); // 'excel' | 'csv' | null

    // 1. Kiểm tra tính hợp lệ của khoảng thời gian (TC_REPORT_002)
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start > end) {
        return NextResponse.json(
          {
            success: false,
            message: 'Ngày bắt đầu không được lớn hơn ngày kết thúc!'
          },
          { status: 400 }
        );
      }
    }

    // Danh sách chi nhánh để hiển thị dropdown bộ lọc
    const branches = await query(`SELECT id, branch_name FROM branches WHERE status = 1 ORDER BY id ASC`);
    const isSpecificBranch = branchId !== 'all' && !isNaN(Number(branchId));
    const targetBranchId = isSpecificBranch ? Number(branchId) : null;

    // 2. Xây dựng điều kiện lọc cho danh sách sản phẩm
    let conditions = ['p.status = 1'];
    let params = [];

    if (search) {
      conditions.push('(p.name LIKE ? OR p.id = ? OR CONCAT("SP", LPAD(p.id, 4, "0")) LIKE ?)');
      params.push(`%${search}%`, isNaN(Number(search)) ? -1 : Number(search), `%${search}%`);
    }

    if (categoryId && categoryId !== 'all') {
      conditions.push('p.category_id = ?');
      params.push(categoryId);
    }

    // Điều kiện tồn kho (theo chi nhánh hoặc tổng hệ thống)
    const stockExpr = isSpecificBranch
      ? 'COALESCE(bi.stock_quantity, 0)'
      : 'COALESCE(p.stock, 0)';

    if (stockStatus && stockStatus !== 'all') {
      if (stockStatus === 'out_of_stock') {
        conditions.push(`${stockExpr} = 0`);
      } else if (stockStatus === 'low_stock') {
        conditions.push(`${stockExpr} > 0 AND ${stockExpr} <= 10`);
      } else if (stockStatus === 'in_stock') {
        conditions.push(`${stockExpr} > 10`);
      }
    }

    if (startDate) {
      conditions.push('DATE(p.updated_at) >= ?');
      params.push(startDate);
    }
    if (endDate) {
      conditions.push('DATE(p.updated_at) <= ?');
      params.push(endDate);
    }

    const whereClause = conditions.join(' AND ');

    // 3. Truy vấn tổng hợp kho hàng
    let overall;
    if (isSpecificBranch) {
      const branchStatsQuery = `
        SELECT
          COUNT(DISTINCT p.id) as total_products,
          COALESCE(SUM(bi.stock_quantity), 0) as total_stock_quantity,
          COALESCE(SUM(bi.stock_quantity * p.price), 0) as total_inventory_value,
          COALESCE(SUM(CASE WHEN bi.stock_quantity = 0 THEN 1 ELSE 0 END), 0) as out_of_stock_count,
          COALESCE(SUM(CASE WHEN bi.stock_quantity > 0 AND bi.stock_quantity <= 10 THEN 1 ELSE 0 END), 0) as low_stock_count,
          COALESCE(SUM(CASE WHEN bi.stock_quantity > 10 THEN 1 ELSE 0 END), 0) as in_stock_count
        FROM products p
        LEFT JOIN branch_inventories bi ON bi.product_id = p.id AND bi.branch_id = ?
        WHERE p.status = 1
      `;
      const res = await query(branchStatsQuery, [targetBranchId]);
      overall = res[0];
    } else {
      const overallStatsQuery = `
        SELECT
          COUNT(*) as total_products,
          COALESCE(SUM(stock), 0) as total_stock_quantity,
          COALESCE(SUM(stock * price), 0) as total_inventory_value,
          COALESCE(SUM(CASE WHEN stock = 0 THEN 1 ELSE 0 END), 0) as out_of_stock_count,
          COALESCE(SUM(CASE WHEN stock > 0 AND stock <= 10 THEN 1 ELSE 0 END), 0) as low_stock_count,
          COALESCE(SUM(CASE WHEN stock > 10 THEN 1 ELSE 0 END), 0) as in_stock_count
        FROM products
        WHERE status = 1
      `;
      const res = await query(overallStatsQuery);
      overall = res[0];
    }

    // 4. Truy vấn phân bổ theo danh mục
    let categoryStats;
    if (isSpecificBranch) {
      const catQuery = `
        SELECT
          c.id as category_id,
          c.name as category_name,
          COUNT(p.id) as product_count,
          COALESCE(SUM(bi.stock_quantity), 0) as total_stock,
          COALESCE(SUM(bi.stock_quantity * p.price), 0) as category_value,
          COALESCE(SUM(CASE WHEN COALESCE(bi.stock_quantity, 0) = 0 THEN 1 ELSE 0 END), 0) as out_of_stock_count,
          COALESCE(SUM(CASE WHEN bi.stock_quantity > 0 AND bi.stock_quantity <= 10 THEN 1 ELSE 0 END), 0) as low_stock_count
        FROM categories c
        LEFT JOIN products p ON p.category_id = c.id AND p.status = 1
        LEFT JOIN branch_inventories bi ON bi.product_id = p.id AND bi.branch_id = ?
        GROUP BY c.id, c.name
        ORDER BY category_value DESC, total_stock DESC
      `;
      categoryStats = await query(catQuery, [targetBranchId]);
    } else {
      const catQuery = `
        SELECT
          c.id as category_id,
          c.name as category_name,
          COUNT(p.id) as product_count,
          COALESCE(SUM(p.stock), 0) as total_stock,
          COALESCE(SUM(p.stock * p.price), 0) as category_value,
          COALESCE(SUM(CASE WHEN p.stock = 0 THEN 1 ELSE 0 END), 0) as out_of_stock_count,
          COALESCE(SUM(CASE WHEN p.stock > 0 AND p.stock <= 10 THEN 1 ELSE 0 END), 0) as low_stock_count
        FROM categories c
        LEFT JOIN products p ON p.category_id = c.id AND p.status = 1
        GROUP BY c.id, c.name
        ORDER BY category_value DESC, total_stock DESC
      `;
      categoryStats = await query(catQuery);
    }

    // 5. Truy vấn danh sách chi tiết sản phẩm theo bộ lọc
    const joinBranchInv = isSpecificBranch
      ? `LEFT JOIN branch_inventories bi ON bi.product_id = p.id AND bi.branch_id = ${targetBranchId}`
      : '';

    const productsQuery = `
      SELECT
        p.id,
        CONCAT('SP', LPAD(p.id, 4, '0')) as product_code,
        p.name as product_name,
        p.unit,
        p.price,
        p.discount_price,
        ${stockExpr} as stock,
        (${stockExpr} * p.price) as inventory_value,
        p.category_id,
        COALESCE(c.name, 'Chưa phân loại') as category_name,
        p.thumbnail,
        p.status,
        p.updated_at,
        CASE
          WHEN ${stockExpr} = 0 THEN 'HET_HANG'
          WHEN ${stockExpr} <= 10 THEN 'SAP_HET_HANG'
          ELSE 'CON_HANG'
        END as stock_status,
        CASE
          WHEN ${stockExpr} = 0 THEN 'Hết hàng'
          WHEN ${stockExpr} <= 10 THEN 'Sắp hết hàng'
          ELSE 'Còn hàng'
        END as stock_status_label
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${joinBranchInv}
      WHERE ${whereClause}
      ORDER BY stock ASC, p.id ASC
    `;

    const products = await query(productsQuery, params);

    // 6. Xử lý xuất file CSV / Excel nếu có yêu cầu (TC_REPORT_003)
    if (format === 'excel' || format === 'csv') {
      const nowStr = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
      const timeFilterStr = (startDate && endDate)
        ? `${startDate} đến ${endDate}`
        : (startDate ? `Từ ${startDate}` : (endDate ? `Đến ${endDate}` : 'Toàn thời gian'));

      const branchNameStr = isSpecificBranch
        ? (branches.find(b => b.id === targetBranchId)?.branch_name || `Chi nhánh #${targetBranchId}`)
        : 'Toàn hệ thống (Tổng tất cả chi nhánh)';

      let csv = '\uFEFF'; // BOM UTF-8

      csv += `BÁO CÁO HÀNG TỒN KHO - ĐỒ ĐỔNG 4 MÙA\n`;
      csv += `Chi nhánh báo cáo: ${branchNameStr}\n`;
      csv += `Thời gian xuất: ${nowStr}\n`;
      csv += `Khoảng thời gian: ${timeFilterStr}\n`;
      csv += `Bộ lọc danh mục: ${categoryId || 'Tất cả'}\n`;
      csv += `Bộ lọc trạng thái kho: ${stockStatus || 'Tất cả'}\n\n`;

      csv += `TỔNG HỢP CHỈ SỐ TỒN KHO\n`;
      csv += `Tổng số mặt hàng,${overall.total_products}\n`;
      csv += `Tổng số lượng tồn kho (sản phẩm),${overall.total_stock_quantity}\n`;
      csv += `Tổng giá trị vốn tồn kho (VNĐ),${Math.round(overall.total_inventory_value)}\n`;
      csv += `Số mặt hàng hết hàng (Tồn = 0),${overall.out_of_stock_count}\n`;
      csv += `Số mặt hàng sắp hết hàng (Tồn <= 10),${overall.low_stock_count}\n`;
      csv += `Số mặt hàng còn nhiều (Tồn > 10),${overall.in_stock_count}\n\n`;

      csv += `DANH SÁCH CHI TIẾT SẢN PHẨM TỒN KHO\n`;
      csv += `Mã SP,Tên sản phẩm,Danh mục,Đơn vị tính,Đơn giá (VNĐ),Tồn kho tại chi nhánh,Trạng thái tồn kho,Giá trị tồn kho (VNĐ),Cập nhật gần nhất\n`;
      products.forEach(p => {
        const updatedDateStr = p.updated_at ? new Date(p.updated_at).toLocaleDateString('vi-VN') : 'Mới';
        csv += `${p.product_code},"${p.product_name.replace(/"/g, '""')}","${p.category_name.replace(/"/g, '""')}",${p.unit || 'Sản phẩm'},${p.price},${p.stock},"${p.stock_status_label}",${Math.round(p.inventory_value)},${updatedDateStr}\n`;
      });

      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="Bao_Cao_Ton_Kho_Branch_${branchId}_${Date.now()}.csv"`
        }
      });
    }

    // 7. Trả về kết quả JSON cho Dashboard
    return NextResponse.json({
      success: true,
      branches,
      filter: {
        startDate: startDate || null,
        endDate: endDate || null,
        search: search || null,
        categoryId: categoryId || 'all',
        branchId: branchId || 'all',
        stockStatus: stockStatus || 'all'
      },
      data: {
        overall: {
          total_products: Number(overall.total_products),
          total_stock_quantity: Number(overall.total_stock_quantity),
          total_inventory_value: Number(overall.total_inventory_value),
          out_of_stock_count: Number(overall.out_of_stock_count),
          low_stock_count: Number(overall.low_stock_count),
          in_stock_count: Number(overall.in_stock_count)
        },
        category_distribution: categoryStats.map(c => ({
          category_id: c.category_id,
          category_name: c.category_name,
          product_count: Number(c.product_count),
          total_stock: Number(c.total_stock),
          category_value: Number(c.category_value),
          out_of_stock_count: Number(c.out_of_stock_count),
          low_stock_count: Number(c.low_stock_count)
        })),
        products: products.map(p => ({
          id: p.id,
          product_code: p.product_code,
          product_name: p.product_name,
          category_name: p.category_name,
          category_id: p.category_id,
          unit: p.unit,
          price: Number(p.price),
          discount_price: p.discount_price ? Number(p.discount_price) : null,
          stock: Number(p.stock),
          inventory_value: Number(p.inventory_value),
          thumbnail: p.thumbnail,
          status: p.status,
          stock_status: p.stock_status,
          stock_status_label: p.stock_status_label,
          updated_at: p.updated_at
        }))
      }
    });
  } catch (error) {
    console.error('Lỗi API Báo cáo tồn kho:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Lỗi máy chủ khi lấy dữ liệu báo cáo tồn kho: ' + error.message
      },
      { status: 500 }
    );
  }
}
