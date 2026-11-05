import { NextResponse } from 'next/server';
import { getBranchInventoryData, updateBranchStock } from '@/lib/inventory';

/**
 * FR-011: Quản lý tồn kho riêng theo từng chi nhánh
 * BR-027: Quy tắc quản lý sản phẩm và phân quyền chi nhánh
 * 
 * - GET: Lấy danh sách tồn kho theo chi nhánh (branch_id = 'all' hoặc ID)
 * - PUT: Điều chỉnh số lượng tồn kho của 1 sản phẩm tại 1 chi nhánh
 */

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branch_id') || 'all';
    const search = searchParams.get('search') || '';
    const categoryId = searchParams.get('category_id') || '';
    const stockStatus = searchParams.get('stock_status') || 'all';

    const data = await getBranchInventoryData({
      branchId,
      search,
      categoryId,
      stockStatus,
    });

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('Lỗi GET /api/admin/inventory:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi tải dữ liệu tồn kho: ' + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { branch_id, product_id, stock_quantity, low_stock_threshold, reason, admin_user } = body;

    if (!branch_id || !product_id || stock_quantity === undefined) {
      return NextResponse.json(
        { success: false, message: 'Vui lòng cung cấp đủ branch_id, product_id và stock_quantity.' },
        { status: 400 }
      );
    }

    // Kiểm tra phân quyền Admin Chi Nhánh (BR-026, BR-027):
    // Nếu là Admin Chi Nhánh (role_id !== 1), chỉ được phép sửa chi nhánh của mình!
    if (admin_user && admin_user.role_id !== 1) {
      if (Number(admin_user.branch_id) !== Number(branch_id)) {
        return NextResponse.json(
          {
            success: false,
            message: 'Từ chối truy cập: Bạn chỉ có quyền điều chỉnh tồn kho cho chi nhánh trực thuộc của mình!',
          },
          { status: 403 }
        );
      }
    }

    const result = await updateBranchStock({
      branchId: branch_id,
      productId: product_id,
      stockQuantity: stock_quantity,
      lowStockThreshold: low_stock_threshold,
      reason: reason || 'Điều chỉnh tồn kho từ trang quản trị',
      adminUser: admin_user,
      request,
    });

    return NextResponse.json({
      success: true,
      message: 'Cập nhật số lượng tồn kho thành công!',
      data: result,
    });
  } catch (error) {
    console.error('Lỗi PUT /api/admin/inventory:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi cập nhật tồn kho: ' + error.message },
      { status: 500 }
    );
  }
}
