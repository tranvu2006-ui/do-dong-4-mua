import { query } from './db.js';
import { logSystemAction } from './logger.js';

/**
 * Đồng bộ tồn kho chi nhánh và liên kết tồn kho sản phẩm nếu chưa có
 */
export async function ensureBranchInventoriesTable() {
  // 1. Không tự động chèn lại chi nhánh nếu người dùng đã xóa (để tôn trọng dữ liệu quản trị)
  const existingBranches = await query(`SELECT id, branch_name FROM branches`);

  // 4. Nếu bảng products chưa có sản phẩm nào, tự động nạp danh sách sản phẩm mẫu chuẩn
  const existingProducts = await query(`SELECT id, name, stock FROM products`);
  if (existingProducts.length === 0) {
    // Đảm bảo categories mẫu
    const existingCats = await query(`SELECT id FROM categories`);
    if (existingCats.length === 0) {
      await query(`
        INSERT INTO categories (id, name, slug, description, status) VALUES
        (1, 'Trái cây tươi', 'trai-cay-tuoi', 'Trái cây tươi đặc sản 4 mùa chuẩn VietGAP', 1),
        (2, 'Combo trái cây', 'combo-trai-cay', 'Combo tiện lợi cho gia đình và văn phòng', 1),
        (3, 'Giỏ quà trái cây', 'gio-qua-trai-cay', 'Giỏ quà biếu tặng sang trọng lịch sự', 1)
        ON DUPLICATE KEY UPDATE status=1;
      `);
    }

    // Lấy ID danh mục thực tế trong database
    const [catFresh] = await query(`SELECT id FROM categories WHERE slug = 'trai-cay-tuoi' OR name LIKE '%tươi%' LIMIT 1`);
    const [catCombo] = await query(`SELECT id FROM categories WHERE slug = 'combo-trai-cay' OR name LIKE '%combo%' LIMIT 1`);
    const [catGift] = await query(`SELECT id FROM categories WHERE slug = 'gio-qua-trai-cay' OR name LIKE '%giỏ quà%' LIMIT 1`);

    const freshId = catFresh?.id || 1;
    const comboId = catCombo?.id || 2;
    const giftId = catGift?.id || 4;

    await query(`
      INSERT INTO products (id, category_id, name, slug, description, price, discount_price, unit, stock, thumbnail, is_featured, status) VALUES
      (1, ${freshId}, 'Dưa Lưới Huỳnh Long Ruột Cam VietGAP', 'dua-luoi-huynh-long-vietgap', 'Dưa lưới Huỳnh Long giòn ngọt đậm đà, thơm mát thanh nhiệt.', 85000, 75000, 'kg', 80, 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500', 1, 1),
      (2, ${freshId}, 'Dưa Hấu Không Hạt Mặt Trời Đỏ', 'dua-hau-khong-hat-mat-troi-do', 'Dưa hấu không hạt ruột đỏ mọng nước, vị ngọt thanh mát giải nhiệt mùa Hạ.', 35000, NULL, 'kg', 150, 'https://images.unsplash.com/photo-1589984662646-e7b2e495949c?w=500', 0, 1),
      (3, ${freshId}, 'Xoài Cát Hòa Lộc Tiền Giang Xuất Khẩu', 'xoai-cat-hoa-loc-xuat-khau', 'Xoài cát Hòa Lộc quả to đều, thịt dày thơm nức mũi, ngọt lịm tan trong miệng.', 120000, 105000, 'kg', 60, 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=500', 1, 1),
      (4, ${freshId}, 'Bưởi Da Xanh Bến Tre Ruột Hồng', 'buoi-da-xanh-ben-tre', 'Bưởi da xanh tép hồng mọng nước, không hột, vị chua ngọt hài hòa thanh khiết.', 90000, 85000, 'kg', 95, 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500', 1, 1),
      (5, ${comboId}, 'Combo Trái Cây 4 Mùa Gia Đình (5kg)', 'combo-trai-cay-4-mua-gia-dinh', 'Gói kết hợp dưa lưới, bưởi da xanh, táo, cam sành dinh dưỡng cho cả tuần.', 250000, 220000, 'combo', 40, 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=500', 1, 1),
      (6, ${giftId}, 'Giỏ Quà Trái Cây Tri Ân Thượng Hạng', 'gio-qua-trai-cay-tri-an', 'Giỏ quà biếu tặng đối tác, gia đình trang trọng với trái cây nhập khẩu tuyển chọn.', 650000, NULL, 'giỏ', 25, 'https://images.unsplash.com/photo-1527515862127-a4fc05baf7a5?w=500', 1, 1)
      ON DUPLICATE KEY UPDATE status=1;
    `);
  }

  // 5. Tự động đồng bộ các cặp (branch_id, product_id) vào branch_inventories nếu còn thiếu
  const allBranches = await query(`SELECT id FROM branches WHERE status = 1`);
  const allProducts = await query(`SELECT id, stock FROM products`);

  for (const b of allBranches) {
    for (const p of allProducts) {
      // Kiểm tra xem đã có bản ghi tồn kho chưa
      const inv = await query(
        `SELECT id, stock_quantity FROM branch_inventories WHERE branch_id = ? AND product_id = ?`,
        [b.id, p.id]
      );
      if (inv.length === 0) {
        // Phân bổ mẫu: Chi nhánh 1 có 60% tổng stock, Chi nhánh 2 có 25%, Chi nhánh 3 có 15% (tối thiểu 10)
        let initialQty = Math.max(5, Math.floor(p.stock * 0.4));
        if (b.id === 1) {
          initialQty = Math.max(10, Math.floor(p.stock * 0.5));
        } else if (b.id === 2) {
          initialQty = Math.max(5, Math.floor(p.stock * 0.3));
        } else {
          initialQty = Math.max(3, Math.floor(p.stock * 0.2));
        }
        await query(
          `INSERT INTO branch_inventories (branch_id, product_id, stock_quantity, low_stock_threshold)
           VALUES (?, ?, ?, 10)`,
          [b.id, p.id, initialQty]
        );
      }
    }
  }

  // 6. Cập nhật lại products.stock = tổng tồn kho các chi nhánh
  for (const p of allProducts) {
    await syncProductTotalStock(p.id);
  }
}

/**
 * Đồng bộ tổng tồn kho `products.stock` từ các chi nhánh
 */
export async function syncProductTotalStock(productId) {
  const res = await query(
    `SELECT COALESCE(SUM(stock_quantity), 0) AS total_stock 
     FROM branch_inventories 
     WHERE product_id = ?`,
    [productId]
  );
  const totalStock = parseInt(res[0]?.total_stock || 0, 10);
  await query(`UPDATE products SET stock = ? WHERE id = ?`, [totalStock, productId]);
  return totalStock;
}

/**
 * Lấy dữ liệu tồn kho theo bộ lọc
 */
export async function getBranchInventoryData({
  branchId = 'all',
  search = '',
  categoryId = '',
  stockStatus = 'all',
}) {
  await ensureBranchInventoriesTable();

  // Danh sách chi nhánh hoạt động
  const branches = await query(`SELECT id, branch_name, phone, address, status FROM branches WHERE status = 1 ORDER BY id ASC`);

  // Điều kiện lọc sản phẩm
  const whereClauses = ['p.status = 1'];
  const params = [];

  if (search && search.trim()) {
    whereClauses.push('(p.name LIKE ? OR p.id = ?)');
    params.push(`%${search.trim()}%`, isNaN(Number(search.trim())) ? -1 : Number(search.trim()));
  }

  if (categoryId && categoryId !== 'all') {
    whereClauses.push('p.category_id = ?');
    params.push(categoryId);
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  // Lấy danh sách sản phẩm cơ sở
  const products = await query(
    `SELECT p.id, p.name, p.category_id, c.name AS category_name, p.price, p.discount_price,
            p.unit, p.stock AS total_stock, p.thumbnail, p.status, p.updated_at
     FROM products p
     LEFT JOIN categories c ON p.category_id = c.id
     ${whereSql}
     ORDER BY p.id ASC`,
    params
  );

  // Lấy chi tiết tồn kho theo chi nhánh cho các sản phẩm
  const pIds = products.map((p) => p.id);
  let inventoryRows = [];
  if (pIds.length > 0) {
    inventoryRows = await query(
      `SELECT bi.branch_id, bi.product_id, bi.stock_quantity, bi.low_stock_threshold,
              b.branch_name
       FROM branch_inventories bi
       JOIN branches b ON bi.branch_id = b.id
       WHERE bi.product_id IN (${pIds.map(() => '?').join(',')}) AND b.status = 1`,
      pIds
    );
  }

  // Gom nhóm tồn kho theo sản phẩm
  const invMap = {};
  for (const row of inventoryRows) {
    if (!invMap[row.product_id]) invMap[row.product_id] = {};
    invMap[row.product_id][row.branch_id] = {
      branch_id: row.branch_id,
      branch_name: row.branch_name,
      stock_quantity: parseInt(row.stock_quantity, 10),
      low_stock_threshold: parseInt(row.low_stock_threshold || 10, 10),
    };
  }

  // Xử lý dữ liệu sản phẩm kết hợp tồn kho
  const processedProducts = products.map((p) => {
    const branchStocks = branches.map((b) => {
      const stockInfo = invMap[p.id]?.[b.id];
      return {
        branch_id: b.id,
        branch_name: b.branch_name,
        stock_quantity: stockInfo ? stockInfo.stock_quantity : 0,
        low_stock_threshold: stockInfo ? stockInfo.low_stock_threshold : 10,
      };
    });

    let currentStock = p.total_stock;
    if (branchId !== 'all') {
      const targetB = branchStocks.find((bs) => Number(bs.branch_id) === Number(branchId));
      currentStock = targetB ? targetB.stock_quantity : 0;
    }

    let stockStatusLabel = 'in_stock';
    if (currentStock <= 0) {
      stockStatusLabel = 'out_of_stock';
    } else if (currentStock <= 10) {
      stockStatusLabel = 'low_stock';
    }

    return {
      ...p,
      price: Number(p.price),
      discount_price: p.discount_price ? Number(p.discount_price) : null,
      total_stock: Number(p.total_stock),
      current_stock: currentStock,
      stock_status: stockStatusLabel,
      branch_stocks: branchStocks,
    };
  });

  // Lọc theo trạng thái tồn kho nếu có yêu cầu
  let filteredProducts = processedProducts;
  if (stockStatus && stockStatus !== 'all') {
    filteredProducts = processedProducts.filter((p) => p.stock_status === stockStatus);
  }

  // Thống kê tổng hợp cho bộ lọc hiện tại
  let totalStockQty = 0;
  let totalValue = 0;
  let outOfStockCount = 0;
  let lowStockCount = 0;
  let inStockCount = 0;

  for (const p of filteredProducts) {
    totalStockQty += p.current_stock;
    totalValue += p.current_stock * (p.discount_price || p.price);
    if (p.current_stock <= 0) {
      outOfStockCount++;
    } else if (p.current_stock <= 10) {
      lowStockCount++;
    } else {
      inStockCount++;
    }
  }

  return {
    branches,
    selected_branch: branchId,
    stats: {
      total_items: filteredProducts.length,
      total_stock_quantity: totalStockQty,
      total_inventory_value: Math.round(totalValue),
      out_of_stock_count: outOfStockCount,
      low_stock_count: lowStockCount,
      in_stock_count: inStockCount,
    },
    products: filteredProducts,
  };
}

/**
 * Cập nhật số lượng tồn kho của một sản phẩm tại một chi nhánh
 */
export async function updateBranchStock({
  branchId,
  productId,
  stockQuantity,
  lowStockThreshold = 10,
  reason = 'Điều chỉnh tồn kho định kỳ',
  adminUser = null,
  request = null,
}) {
  await ensureBranchInventoriesTable();

  const numBranchId = parseInt(branchId, 10);
  const numProductId = parseInt(productId, 10);
  const numStock = parseInt(stockQuantity, 10);

  if (isNaN(numBranchId) || isNaN(numProductId) || isNaN(numStock) || numStock < 0) {
    throw new Error('Thông tin chi nhánh, sản phẩm hoặc số lượng tồn kho không hợp lệ (số lượng phải >= 0).');
  }

  // Lấy thông tin cũ để ghi log
  const [oldInv] = await query(
    `SELECT bi.stock_quantity, b.branch_name, p.name AS product_name 
     FROM branch_inventories bi
     JOIN branches b ON bi.branch_id = b.id
     JOIN products p ON bi.product_id = p.id
     WHERE bi.branch_id = ? AND bi.product_id = ?`,
    [numBranchId, numProductId]
  );

  const oldQty = oldInv ? parseInt(oldInv.stock_quantity, 10) : 0;
  const branchName = oldInv?.branch_name || `Chi nhánh #${numBranchId}`;
  const productName = oldInv?.product_name || `Sản phẩm #${numProductId}`;

  // Cập nhật hoặc thêm mới vào branch_inventories
  await query(
    `INSERT INTO branch_inventories (branch_id, product_id, stock_quantity, low_stock_threshold, updated_at)
     VALUES (?, ?, ?, ?, NOW())
     ON DUPLICATE KEY UPDATE 
       stock_quantity = VALUES(stock_quantity),
       low_stock_threshold = VALUES(low_stock_threshold),
       updated_at = NOW()`,
    [numBranchId, numProductId, numStock, parseInt(lowStockThreshold, 10) || 10]
  );

  // Đồng bộ lại tổng tồn kho products.stock
  const newTotalStock = await syncProductTotalStock(numProductId);

  // Ghi nhật ký kiểm toán hệ thống (FR-045, BR-030)
  try {
    const adminName = adminUser?.full_name || 'Quản trị viên';
    const desc = `${adminName} điều chỉnh tồn kho sản phẩm "${productName}" tại ${branchName}: từ ${oldQty} thành ${numStock} (Lý do: ${reason}). Tổng tồn hệ thống: ${newTotalStock}.`;
    await logSystemAction({
      request,
      userId: adminUser?.id || 1,
      action: 'UPDATE_STOCK',
      module: 'PRODUCT',
      description: desc,
    });
  } catch (logErr) {
    console.warn('Lỗi ghi log tồn kho:', logErr.message);
  }

  return {
    branch_id: numBranchId,
    product_id: numProductId,
    old_stock: oldQty,
    new_stock: numStock,
    total_stock: newTotalStock,
  };
}
