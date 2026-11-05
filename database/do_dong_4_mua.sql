/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET FOREIGN_KEY_CHECKS=0 */;

-- --------------------------------------------------------
-- Table structure for table `banners`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `banners`;
CREATE TABLE `banners` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tiêu đề banner',
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Đường dẫn ảnh banner',
  `link_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Đường dẫn liên kết khi bấm vào banner',
  `display_order` int NOT NULL DEFAULT '0' COMMENT 'Thứ tự ưu tiên hiển thị',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1: Hiển thị, 0: Ẩn',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý banner khuyến mãi và quảng cáo';

-- --------------------------------------------------------
-- Table structure for table `branch_inventories`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `branch_inventories`;
CREATE TABLE `branch_inventories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `branch_id` bigint unsigned NOT NULL COMMENT 'Khóa ngoại chi nhánh',
  `product_id` bigint unsigned NOT NULL COMMENT 'Khóa ngoại sản phẩm',
  `stock_quantity` int NOT NULL DEFAULT '0' COMMENT 'Số lượng tồn kho tại chi nhánh này',
  `low_stock_threshold` int NOT NULL DEFAULT '10' COMMENT 'Ngưỡng cảnh báo sắp hết hàng',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `branch_product_unique` (`branch_id`,`product_id`),
  KEY `idx_branch_id` (`branch_id`),
  KEY `idx_product_id` (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý tồn kho riêng biệt theo từng chi nhánh (FR-011, BR-027)';

-- --------------------------------------------------------
-- Table structure for table `branches`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `branches`;
CREATE TABLE `branches` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `branch_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên chi nhánh',
  `phone` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Số điện thoại chi nhánh',
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Địa chỉ chi nhánh',
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1: Hoạt động, 0: Tạm đóng',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `branches_status_index` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý danh sách chi nhánh';

-- --------------------------------------------------------
-- Table structure for table `cart_items`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `cart_items`;
CREATE TABLE `cart_items` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `cart_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned NOT NULL,
  `quantity` int NOT NULL DEFAULT '1' COMMENT 'Số lượng',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `unit_price` decimal(12,2) DEFAULT '0.00',
  `subtotal` decimal(12,2) DEFAULT '0.00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `cart_items_cart_product_unique` (`cart_id`,`product_id`),
  KEY `cart_items_product_id_foreign` (`product_id`),
  CONSTRAINT `cart_items_cart_id_foreign` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Chi tiết mặt hàng trong giỏ';

-- --------------------------------------------------------
-- Table structure for table `carts`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `carts`;
CREATE TABLE `carts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL COMMENT 'Khách hàng sở hữu giỏ',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` tinyint DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `carts_user_id_unique` (`user_id`),
  CONSTRAINT `carts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Giỏ hàng lưu trữ tạm';

-- --------------------------------------------------------
-- Table structure for table `categories`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên danh mục',
  `slug` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Đường dẫn tĩnh SEO',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT 'Mô tả danh mục',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1: Hiển thị, 0: Ẩn',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_slug_unique` (`slug`),
  KEY `categories_status_index` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Danh mục sản phẩm trái cây';

-- Dumping data for table `categories`
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `status`, `created_at`, `updated_at`) VALUES (1, 'Trái cây tươi', 'trai-cay-tuoi', 'Các loại trái cây tươi ngon theo mùa vụ, đạt chuẩn VietGAP và nhập khẩu cao cấp.', 1, '2026-10-28 07:02:31', '2026-11-01 02:57:56');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `status`, `created_at`, `updated_at`) VALUES (2, 'Combo trái cây', 'combo-trai-cay', 'Gói kết hợp nhiều loại trái cây ăn gia đình, văn phòng với giá ưu đãi.', 1, '2026-10-30 19:24:31', '2026-11-01 02:57:57');
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `status`, `created_at`, `updated_at`) VALUES (4, 'Giỏ quà trái cây', 'gio-qua-trai-cay', 'Giỏ quà biếu tặng sang trọng, thiết kế theo mẫu cố định chuẩn chất lượng cao.', 1, '2026-10-30 19:28:10', '2026-11-01 02:57:57');

-- --------------------------------------------------------
-- Table structure for table `notifications`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `recipient_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ALL',
  `recipient_ids` text COLLATE utf8mb4_unicode_ci,
  `recipient_names` text COLLATE utf8mb4_unicode_ci,
  `sender_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_recipient` (`recipient_type`),
  KEY `idx_created` (`created_at`),
  KEY `fk_notifications_sender` (`sender_id`),
  CONSTRAINT `fk_notifications_sender` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `order_details`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `order_details`;
CREATE TABLE `order_details` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned NOT NULL,
  `quantity` int NOT NULL DEFAULT '1' COMMENT 'Số lượng mua',
  `unit_price` decimal(15,2) NOT NULL DEFAULT '0.00' COMMENT 'Giá tại thời điểm mua',
  `total_price` decimal(15,2) NOT NULL DEFAULT '0.00' COMMENT 'Thành tiền dòng',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `subtotal` decimal(12,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_details_order_id_foreign` (`order_id`),
  KEY `order_details_product_id_foreign` (`product_id`),
  CONSTRAINT `order_details_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_details_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Chi tiết các món trong đơn hàng';

-- Dumping data for table `order_details`
INSERT INTO `order_details` (`id`, `order_id`, `product_id`, `quantity`, `unit_price`, `total_price`, `created_at`, `updated_at`, `subtotal`) VALUES (24, 25, 2, 5, '35000.00', '175000.00', '2026-11-05 01:48:45', '2026-11-05 01:48:45', NULL);

-- --------------------------------------------------------
-- Table structure for table `orders`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_code` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Mã đơn dạng OD...',
  `user_id` bigint unsigned NOT NULL COMMENT 'Khách hàng đặt mua',
  `branch_id` bigint unsigned DEFAULT '1' COMMENT 'Chi nhánh xử lý đơn hàng',
  `receiver_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên người nhận hàng',
  `phone` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'SĐT người nhận',
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Địa chỉ giao hàng',
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT 'Ghi chú giao hàng',
  `subtotal` decimal(15,2) NOT NULL DEFAULT '0.00' COMMENT 'Tiền hàng',
  `shipping_fee` decimal(15,2) NOT NULL DEFAULT '0.00' COMMENT 'Phí vận chuyển',
  `total_amount` decimal(15,2) NOT NULL DEFAULT '0.00' COMMENT 'Tổng thanh toán',
  `payment_status` enum('UNPAID','PAID') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'UNPAID' COMMENT 'Trạng thái thanh toán',
  `order_status` enum('CHO_THANH_TOAN','CHO_XAC_NHAN','DA_XAC_NHAN','DANG_CHUAN_BI','TAM_DUNG','DANG_GIAO','DA_GIAO','DA_HUY') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CHO_XAC_NHAN' COMMENT 'Vòng đời 8 trạng thái',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `orders_order_code_unique` (`order_code`),
  KEY `orders_user_id_foreign` (`user_id`),
  KEY `orders_order_status_index` (`order_status`),
  CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý thông tin đơn hàng';

-- Dumping data for table `orders`
INSERT INTO `orders` (`id`, `order_code`, `user_id`, `branch_id`, `receiver_name`, `phone`, `address`, `note`, `subtotal`, `shipping_fee`, `total_amount`, `payment_status`, `order_status`, `created_at`, `updated_at`) VALUES (25, 'OD202611052409', 33, 1, 'Nguyễn Văn Test Kho', '0901234567', '123 Lê Duẩn, Quận 1, TP.HCM', 'Giao hỏa tốc GreenSM từ kho Q1', '175000.00', '0.00', '175000.00', 'UNPAID', 'CHO_XAC_NHAN', '2026-11-05 01:48:45', '2026-11-05 01:48:45');

-- --------------------------------------------------------
-- Table structure for table `payments`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `payments`;
CREATE TABLE `payments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `payment_method` enum('COD','VIETQR','MOMO') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'COD' COMMENT 'Phương thức',
  `transaction_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Mã giao dịch ngân hàng/ví',
  `amount` decimal(15,2) NOT NULL DEFAULT '0.00' COMMENT 'Số tiền thanh toán',
  `status` enum('PENDING','PAID','FAILED') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING' COMMENT 'Trạng thái',
  `payment_time` datetime DEFAULT NULL COMMENT 'Thời gian thanh toán',
  `details` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT 'Phản hồi từ cổng thanh toán',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `payment_amount` decimal(12,2) DEFAULT NULL,
  `payment_status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `payments_order_id_unique` (`order_id`),
  KEY `payments_transaction_code_index` (`transaction_code`),
  CONSTRAINT `payments_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Lịch sử và trạng thái thanh toán';

-- Dumping data for table `payments`
INSERT INTO `payments` (`id`, `order_id`, `payment_method`, `transaction_code`, `amount`, `status`, `payment_time`, `details`, `created_at`, `updated_at`, `payment_amount`, `payment_status`, `note`) VALUES (38, 25, 'COD', NULL, '175000.00', 'PENDING', NULL, NULL, '2026-11-05 01:48:45', '2026-11-05 01:48:45', NULL, NULL, NULL);

-- --------------------------------------------------------
-- Table structure for table `permissions`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `permissions`;
CREATE TABLE `permissions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `permission_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên quyền',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT 'Mô tả quyền',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_permission_name_unique` (`permission_name`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Danh mục quyền hệ thống';

-- Dumping data for table `permissions`
INSERT INTO `permissions` (`id`, `permission_name`, `description`, `created_at`, `updated_at`) VALUES (1, 'product.view', 'Xem danh sách sản phẩm', '2026-10-30 19:08:32', '2026-10-30 19:08:32');
INSERT INTO `permissions` (`id`, `permission_name`, `description`, `created_at`, `updated_at`) VALUES (2, 'product.create', 'Thêm sản phẩm mới', '2026-10-30 19:08:32', '2026-10-30 19:08:32');
INSERT INTO `permissions` (`id`, `permission_name`, `description`, `created_at`, `updated_at`) VALUES (3, 'product.update', 'Cập nhật thông tin sản phẩm', '2026-10-30 19:08:32', '2026-10-30 19:08:32');
INSERT INTO `permissions` (`id`, `permission_name`, `description`, `created_at`, `updated_at`) VALUES (4, 'product.delete', 'Xóa sản phẩm', '2026-10-30 19:08:32', '2026-10-30 19:08:32');
INSERT INTO `permissions` (`id`, `permission_name`, `description`, `created_at`, `updated_at`) VALUES (5, 'category.manage', 'Quản lý danh mục mùa vụ', '2026-10-30 19:08:32', '2026-10-30 19:08:32');
INSERT INTO `permissions` (`id`, `permission_name`, `description`, `created_at`, `updated_at`) VALUES (6, 'order.view', 'Xem danh sách đơn hàng', '2026-10-30 19:08:32', '2026-10-30 19:08:32');
INSERT INTO `permissions` (`id`, `permission_name`, `description`, `created_at`, `updated_at`) VALUES (7, 'order.update', 'Cập nhật trạng thái đơn & vận đơn', '2026-10-30 19:08:32', '2026-10-30 19:08:32');
INSERT INTO `permissions` (`id`, `permission_name`, `description`, `created_at`, `updated_at`) VALUES (8, 'order.cancel', 'Hủy đơn hàng', '2026-10-30 19:08:32', '2026-10-30 19:08:32');
INSERT INTO `permissions` (`id`, `permission_name`, `description`, `created_at`, `updated_at`) VALUES (9, 'shipment.manage', 'Quản lý vận đơn GreenSM', '2026-10-30 19:08:32', '2026-10-30 19:08:32');
INSERT INTO `permissions` (`id`, `permission_name`, `description`, `created_at`, `updated_at`) VALUES (10, 'promotion.manage', 'Quản lý chương trình khuyến mãi', '2026-10-30 19:08:32', '2026-10-30 19:08:32');
INSERT INTO `permissions` (`id`, `permission_name`, `description`, `created_at`, `updated_at`) VALUES (11, 'branch.manage', 'Quản lý chi nhánh', '2026-10-30 19:08:32', '2026-10-30 19:08:32');
INSERT INTO `permissions` (`id`, `permission_name`, `description`, `created_at`, `updated_at`) VALUES (12, 'banner.manage', 'Quản lý banner quảng cáo', '2026-10-30 19:08:32', '2026-10-30 19:08:32');
INSERT INTO `permissions` (`id`, `permission_name`, `description`, `created_at`, `updated_at`) VALUES (13, 'report.view', 'Xem báo cáo doanh thu', '2026-10-30 19:08:32', '2026-10-30 19:08:32');
INSERT INTO `permissions` (`id`, `permission_name`, `description`, `created_at`, `updated_at`) VALUES (14, 'user.manage', 'Quản lý tài khoản quản trị', '2026-10-30 19:08:32', '2026-10-30 19:08:32');
INSERT INTO `permissions` (`id`, `permission_name`, `description`, `created_at`, `updated_at`) VALUES (15, 'system.log', 'Xem nhật ký hệ thống', '2026-10-30 19:08:32', '2026-10-30 19:08:32');
INSERT INTO `permissions` (`id`, `permission_name`, `description`, `created_at`, `updated_at`) VALUES (16, 'inventory.manage', 'Quản lý tồn kho trái cây chi nhánh', '2026-11-01 01:54:43', '2026-11-01 01:57:07');
INSERT INTO `permissions` (`id`, `permission_name`, `description`, `created_at`, `updated_at`) VALUES (17, 'customer.view', 'Quản lý danh sách khách hàng', '2026-11-01 01:54:43', '2026-11-01 01:57:07');
INSERT INTO `permissions` (`id`, `permission_name`, `description`, `created_at`, `updated_at`) VALUES (18, 'payment.confirm', 'Quản lý và xác nhận thanh toán', '2026-11-01 01:54:43', '2026-11-01 01:57:07');

-- --------------------------------------------------------
-- Table structure for table `product_images`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `product_images`;
CREATE TABLE `product_images` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL COMMENT 'Sản phẩm tương ứng',
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Đường dẫn ảnh',
  `display_order` int NOT NULL DEFAULT '0' COMMENT 'Thứ tự hiển thị',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `sort_order` int DEFAULT '1',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `product_images_product_id_foreign` (`product_id`),
  CONSTRAINT `product_images_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bộ sưu tập ảnh chi tiết sản phẩm';

-- --------------------------------------------------------
-- Table structure for table `products`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `category_id` bigint unsigned NOT NULL COMMENT 'Khóa ngoại danh mục',
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên sản phẩm',
  `slug` varchar(180) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Đường dẫn tĩnh SEO',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT 'Mô tả chi tiết',
  `price` decimal(15,2) NOT NULL DEFAULT '0.00' COMMENT 'Giá gốc',
  `discount_price` decimal(15,2) DEFAULT NULL COMMENT 'Giá khuyến mãi nếu có',
  `unit` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'kg' COMMENT 'Đơn vị tính (kg, giỏ, combo)',
  `stock` int NOT NULL DEFAULT '0' COMMENT 'Số lượng tồn kho',
  `thumbnail` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Ảnh đại diện chính',
  `is_featured` tinyint(1) NOT NULL DEFAULT '0' COMMENT '1: Nổi bật, 0: Bình thường',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1: Đang bán, 0: Ngừng bán',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `products_slug_unique` (`slug`),
  KEY `products_category_id_foreign` (`category_id`),
  KEY `products_status_index` (`status`),
  KEY `products_is_featured_index` (`is_featured`),
  CONSTRAINT `products_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Thông tin sản phẩm trái cây';

-- Dumping data for table `products`
INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `price`, `discount_price`, `unit`, `stock`, `thumbnail`, `is_featured`, `status`, `created_at`, `updated_at`) VALUES (1, 1, 'Dưa Lưới Huỳnh Long Ruột Cam VietGAP', 'dua-luoi-huynh-long-vietgap', 'Dưa lưới Huỳnh Long giòn ngọt đậm đà, thơm mát thanh nhiệt.', '85000.00', '75000.00', 'kg', 0, 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500', 1, 1, '2026-11-05 01:43:47', '2026-11-05 15:46:35');
INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `price`, `discount_price`, `unit`, `stock`, `thumbnail`, `is_featured`, `status`, `created_at`, `updated_at`) VALUES (2, 1, 'Dưa Hấu Không Hạt Mặt Trời Đỏ', 'dua-hau-khong-hat-mat-troi-do', 'Dưa hấu không hạt ruột đỏ mọng nước, vị ngọt thanh mát giải nhiệt mùa Hạ.', '35000.00', NULL, 'kg', 0, 'https://images.unsplash.com/photo-1589984662646-e7b2e495949c?w=500', 0, 1, '2026-11-05 01:43:47', '2026-11-05 15:46:35');
INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `price`, `discount_price`, `unit`, `stock`, `thumbnail`, `is_featured`, `status`, `created_at`, `updated_at`) VALUES (3, 1, 'Xoài Cát Hòa Lộc Tiền Giang Xuất Khẩu', 'xoai-cat-hoa-loc-xuat-khau', 'Xoài cát Hòa Lộc quả to đều, thịt dày thơm nức mũi, ngọt lịm tan trong miệng.', '120000.00', '105000.00', 'kg', 0, 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=500', 1, 1, '2026-11-05 01:43:47', '2026-11-05 15:46:35');
INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `price`, `discount_price`, `unit`, `stock`, `thumbnail`, `is_featured`, `status`, `created_at`, `updated_at`) VALUES (4, 1, 'Bưởi Da Xanh Bến Tre Ruột Hồng', 'buoi-da-xanh-ben-tre', 'Bưởi da xanh tép hồng mọng nước, không hột, vị chua ngọt hài hòa thanh khiết.', '90000.00', '85000.00', 'kg', 0, 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500', 1, 1, '2026-11-05 01:43:47', '2026-11-05 15:46:35');
INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `price`, `discount_price`, `unit`, `stock`, `thumbnail`, `is_featured`, `status`, `created_at`, `updated_at`) VALUES (5, 2, 'Combo Trái Cây 4 Mùa Gia Đình (5kg)', 'combo-trai-cay-4-mua-gia-dinh', 'Gói kết hợp dưa lưới, bưởi da xanh, táo, cam sành dinh dưỡng cho cả tuần.', '250000.00', '220000.00', 'combo', 0, 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=500', 1, 1, '2026-11-05 01:43:47', '2026-11-05 15:46:35');
INSERT INTO `products` (`id`, `category_id`, `name`, `slug`, `description`, `price`, `discount_price`, `unit`, `stock`, `thumbnail`, `is_featured`, `status`, `created_at`, `updated_at`) VALUES (6, 4, 'Giỏ Quà Trái Cây Tri Ân Thượng Hạng', 'gio-qua-trai-cay-tri-an', 'Giỏ quà biếu tặng đối tác, gia đình trang trọng với trái cây nhập khẩu tuyển chọn.', '650000.00', NULL, 'giỏ', 0, 'https://images.unsplash.com/photo-1527515862127-a4fc05baf7a5?w=500', 1, 1, '2026-11-05 01:43:47', '2026-11-05 15:46:35');

-- --------------------------------------------------------
-- Table structure for table `promotion_products`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `promotion_products`;
CREATE TABLE `promotion_products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `promotion_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `promotion_products_unique` (`promotion_id`,`product_id`),
  KEY `promotion_products_product_id_foreign` (`product_id`),
  CONSTRAINT `promotion_products_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `promotion_products_promotion_id_foreign` FOREIGN KEY (`promotion_id`) REFERENCES `promotions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Liên kết khuyến mãi và sản phẩm';

-- --------------------------------------------------------
-- Table structure for table `promotions`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `promotions`;
CREATE TABLE `promotions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tiêu đề khuyến mãi',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT 'Nội dung chi tiết',
  `discount_percent` decimal(5,2) NOT NULL DEFAULT '0.00' COMMENT 'Phần trăm giảm giá',
  `start_date` datetime NOT NULL COMMENT 'Thời gian bắt đầu',
  `end_date` datetime NOT NULL COMMENT 'Thời gian kết thúc',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1: Hoạt động, 0: Hết hạn/Tắt',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `promotions_status_index` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Chương trình khuyến mãi';

-- --------------------------------------------------------
-- Table structure for table `role_permissions`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `role_permissions`;
CREATE TABLE `role_permissions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `role_id` bigint unsigned NOT NULL,
  `permission_id` bigint unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `role_permissions_role_perm_unique` (`role_id`,`permission_id`),
  KEY `role_permissions_permission_id_foreign` (`permission_id`),
  CONSTRAINT `role_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `role_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng phân quyền vai trò';

-- Dumping data for table `role_permissions`
INSERT INTO `role_permissions` (`id`, `role_id`, `permission_id`, `created_at`) VALUES (1, 1, 12, '2026-10-30 19:08:32');
INSERT INTO `role_permissions` (`id`, `role_id`, `permission_id`, `created_at`) VALUES (2, 1, 11, '2026-10-30 19:08:32');
INSERT INTO `role_permissions` (`id`, `role_id`, `permission_id`, `created_at`) VALUES (3, 1, 5, '2026-10-30 19:08:32');
INSERT INTO `role_permissions` (`id`, `role_id`, `permission_id`, `created_at`) VALUES (4, 1, 8, '2026-10-30 19:08:32');
INSERT INTO `role_permissions` (`id`, `role_id`, `permission_id`, `created_at`) VALUES (5, 1, 7, '2026-10-30 19:08:32');
INSERT INTO `role_permissions` (`id`, `role_id`, `permission_id`, `created_at`) VALUES (6, 1, 6, '2026-10-30 19:08:32');
INSERT INTO `role_permissions` (`id`, `role_id`, `permission_id`, `created_at`) VALUES (7, 1, 2, '2026-10-30 19:08:32');
INSERT INTO `role_permissions` (`id`, `role_id`, `permission_id`, `created_at`) VALUES (8, 1, 4, '2026-10-30 19:08:32');
INSERT INTO `role_permissions` (`id`, `role_id`, `permission_id`, `created_at`) VALUES (9, 1, 3, '2026-10-30 19:08:32');
INSERT INTO `role_permissions` (`id`, `role_id`, `permission_id`, `created_at`) VALUES (10, 1, 1, '2026-10-30 19:08:32');
INSERT INTO `role_permissions` (`id`, `role_id`, `permission_id`, `created_at`) VALUES (11, 1, 10, '2026-10-30 19:08:32');
INSERT INTO `role_permissions` (`id`, `role_id`, `permission_id`, `created_at`) VALUES (12, 1, 13, '2026-10-30 19:08:32');
INSERT INTO `role_permissions` (`id`, `role_id`, `permission_id`, `created_at`) VALUES (13, 1, 9, '2026-10-30 19:08:32');
INSERT INTO `role_permissions` (`id`, `role_id`, `permission_id`, `created_at`) VALUES (14, 1, 15, '2026-10-30 19:08:32');
INSERT INTO `role_permissions` (`id`, `role_id`, `permission_id`, `created_at`) VALUES (15, 1, 14, '2026-10-30 19:08:32');
INSERT INTO `role_permissions` (`id`, `role_id`, `permission_id`, `created_at`) VALUES (75, 2, 1, '2026-10-30 19:55:33');
INSERT INTO `role_permissions` (`id`, `role_id`, `permission_id`, `created_at`) VALUES (76, 2, 2, '2026-10-30 19:55:33');
INSERT INTO `role_permissions` (`id`, `role_id`, `permission_id`, `created_at`) VALUES (77, 2, 6, '2026-10-30 19:55:33');
INSERT INTO `role_permissions` (`id`, `role_id`, `permission_id`, `created_at`) VALUES (78, 2, 7, '2026-10-30 19:55:33');
INSERT INTO `role_permissions` (`id`, `role_id`, `permission_id`, `created_at`) VALUES (79, 2, 9, '2026-10-30 19:55:33');
INSERT INTO `role_permissions` (`id`, `role_id`, `permission_id`, `created_at`) VALUES (80, 2, 13, '2026-10-30 19:55:33');

-- --------------------------------------------------------
-- Table structure for table `roles`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên vai trò',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT 'Mô tả vai trò',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_role_name_unique` (`role_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng vai trò người dùng';

-- Dumping data for table `roles`
INSERT INTO `roles` (`id`, `role_name`, `description`, `created_at`, `updated_at`) VALUES (1, 'Admin Tổng', 'Quản trị viên toàn quyền hệ thống', '2026-10-28 06:30:18', '2026-10-28 06:30:18');
INSERT INTO `roles` (`id`, `role_name`, `description`, `created_at`, `updated_at`) VALUES (2, 'Admin Chi nhánh', 'Quản lý kho và đơn hàng tại chi nhánh', '2026-10-28 06:30:18', '2026-10-28 06:30:18');
INSERT INTO `roles` (`id`, `role_name`, `description`, `created_at`, `updated_at`) VALUES (3, 'Khách hàng', 'Người mua hàng trực tuyến', '2026-10-28 06:30:18', '2026-10-28 06:30:18');

-- --------------------------------------------------------
-- Table structure for table `shipments`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `shipments`;
CREATE TABLE `shipments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL COMMENT 'Đơn hàng vận chuyển',
  `shipping_company` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'GreenSM' COMMENT 'Đơn vị vận chuyển (mặc định GreenSM)',
  `tracking_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Mã vận đơn tra cứu',
  `shipping_fee` decimal(15,2) NOT NULL DEFAULT '0.00' COMMENT 'Phí vận chuyển',
  `shipping_status` enum('CHO_TAO_VAN_DON','DA_TAO_VAN_DON','DA_BAN_GIAO_GREENSM','DANG_GIAO','GIAO_THANH_CONG','GIAO_THAT_BAI') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CHO_TAO_VAN_DON' COMMENT 'Trạng thái vận chuyển',
  `ship_date` datetime DEFAULT NULL COMMENT 'Ngày bàn giao đơn vị vận chuyển',
  `delivery_date` datetime DEFAULT NULL COMMENT 'Ngày giao hàng thành công',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `shipments_order_id_unique` (`order_id`),
  UNIQUE KEY `shipments_tracking_code_unique` (`tracking_code`),
  CONSTRAINT `shipments_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý vận đơn và lộ trình giao hàng';

-- Dumping data for table `shipments`
INSERT INTO `shipments` (`id`, `order_id`, `shipping_company`, `tracking_code`, `shipping_fee`, `shipping_status`, `ship_date`, `delivery_date`, `created_at`, `updated_at`) VALUES (38, 25, 'GreenSM', NULL, '0.00', '', NULL, NULL, '2026-11-05 01:48:45', '2026-11-05 01:48:45');

-- --------------------------------------------------------
-- Table structure for table `shipping_fees`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `shipping_fees`;
CREATE TABLE `shipping_fees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên gói/nấc cước',
  `min_km` decimal(6,2) NOT NULL DEFAULT '0.00' COMMENT 'Khoảng cách từ (km)',
  `max_km` decimal(6,2) NOT NULL DEFAULT '0.00' COMMENT 'Khoảng cách đến (km)',
  `fee` decimal(12,2) NOT NULL DEFAULT '0.00' COMMENT 'Mức phí vận chuyển (VNĐ)',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1: Áp dụng, 0: Tạm dừng',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `shipping_fees`
INSERT INTO `shipping_fees` (`id`, `name`, `min_km`, `max_km`, `fee`, `status`, `created_at`, `updated_at`) VALUES (1, 'Nội thành gần (Dưới 5 km)', '0.00', '5.00', '15000.00', 1, '2026-11-04 17:38:47', '2026-11-04 17:38:47');
INSERT INTO `shipping_fees` (`id`, `name`, `min_km`, `max_km`, `fee`, `status`, `created_at`, `updated_at`) VALUES (2, 'Tiêu chuẩn nội thành (5 - 10 km)', '5.00', '10.00', '25000.00', 1, '2026-11-04 17:38:47', '2026-11-04 17:38:47');
INSERT INTO `shipping_fees` (`id`, `name`, `min_km`, `max_km`, `fee`, `status`, `created_at`, `updated_at`) VALUES (3, 'Nội thành xa (10 - 20 km)', '10.00', '20.00', '40000.00', 1, '2026-11-04 17:38:47', '2026-11-04 17:38:47');
INSERT INTO `shipping_fees` (`id`, `name`, `min_km`, `max_km`, `fee`, `status`, `created_at`, `updated_at`) VALUES (4, 'Ngoại thành / Liên quận (Trên 20 km)', '20.00', '50.00', '60000.00', 1, '2026-11-04 17:38:47', '2026-11-04 17:38:47');

-- --------------------------------------------------------
-- Table structure for table `system_logs`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `system_logs`;
CREATE TABLE `system_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL COMMENT 'Người thực hiện hành động (NULL nếu là khách vãng lai hoặc hệ thống tự động)',
  `action` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Hành động: CREATE, UPDATE, DELETE, LOGIN, EXPORT...',
  `module` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Phân hệ: PRODUCT, ORDER, AUTH, BRANCH...',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT 'Mô tả chi tiết thao tác',
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Địa chỉ IP (hỗ trợ IPv4 & IPv6)',
  `user_agent` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT 'Thông tin trình duyệt và thiết bị',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm ghi nhận nhật ký',
  PRIMARY KEY (`id`),
  KEY `system_logs_user_id_foreign` (`user_id`),
  KEY `system_logs_module_action_index` (`module`,`action`),
  CONSTRAINT `system_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=385 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Nhật ký thao tác và audit log hệ thống';

-- Dumping data for table `system_logs`
INSERT INTO `system_logs` (`id`, `user_id`, `action`, `module`, `description`, `ip_address`, `user_agent`, `created_at`) VALUES (372, 1, 'UPDATE_SETTINGS', 'SYSTEM', 'Admin Tổng cập nhật thông số cấu hình hệ thống website', '42.116.110.66', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36', '2026-11-04 17:39:28');
INSERT INTO `system_logs` (`id`, `user_id`, `action`, `module`, `description`, `ip_address`, `user_agent`, `created_at`) VALUES (373, 1, 'UPDATE_SETTINGS', 'SYSTEM', 'Admin Tổng cập nhật thông số cấu hình hệ thống website', '42.116.110.66', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36', '2026-11-04 17:39:51');
INSERT INTO `system_logs` (`id`, `user_id`, `action`, `module`, `description`, `ip_address`, `user_agent`, `created_at`) VALUES (374, 1, 'LOGOUT', 'AUTH', 'Người dùng đăng xuất khỏi hệ thống (0929894248)', NULL, NULL, '2026-11-04 17:40:06');
INSERT INTO `system_logs` (`id`, `user_id`, `action`, `module`, `description`, `ip_address`, `user_agent`, `created_at`) VALUES (375, 32, 'REGISTER', 'USER', 'Khách hàng đăng ký tài khoản thành công qua xác thực OTP: 0123456789', NULL, NULL, '2026-11-04 17:42:34');
INSERT INTO `system_logs` (`id`, `user_id`, `action`, `module`, `description`, `ip_address`, `user_agent`, `created_at`) VALUES (376, 32, 'LOGIN', '', 'Đăng nhập thành công vai trò: Khách hàng', '42.116.110.66', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36', '2026-11-04 17:42:48');
INSERT INTO `system_logs` (`id`, `user_id`, `action`, `module`, `description`, `ip_address`, `user_agent`, `created_at`) VALUES (377, 1, 'LOGIN', '', 'Đăng nhập thành công vai trò: Admin Tổng', '42.116.110.66', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36', '2026-11-04 17:44:23');
INSERT INTO `system_logs` (`id`, `user_id`, `action`, `module`, `description`, `ip_address`, `user_agent`, `created_at`) VALUES (378, 1, 'LOGOUT', 'AUTH', 'Người dùng đăng xuất khỏi hệ thống (0929894248)', NULL, NULL, '2026-11-05 00:38:14');
INSERT INTO `system_logs` (`id`, `user_id`, `action`, `module`, `description`, `ip_address`, `user_agent`, `created_at`) VALUES (379, 1, 'LOGIN', '', 'Đăng nhập thành công vai trò: Admin Tổng', '14.226.251.46', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36', '2026-11-05 00:38:28');
INSERT INTO `system_logs` (`id`, `user_id`, `action`, `module`, `description`, `ip_address`, `user_agent`, `created_at`) VALUES (380, 1, 'UPDATE_SETTINGS', 'SYSTEM', 'Admin Tổng cập nhật thông số cấu hình hệ thống website', '14.226.251.46', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36', '2026-11-05 00:38:52');
INSERT INTO `system_logs` (`id`, `user_id`, `action`, `module`, `description`, `ip_address`, `user_agent`, `created_at`) VALUES (381, 1, 'UPDATE_SETTINGS', 'SYSTEM', 'Admin Tổng cập nhật thông số cấu hình hệ thống website', '14.226.251.46', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36', '2026-11-05 00:39:06');
INSERT INTO `system_logs` (`id`, `user_id`, `action`, `module`, `description`, `ip_address`, `user_agent`, `created_at`) VALUES (382, 1, 'UPDATE_STOCK', 'PRODUCT', 'Trần Vũ (Admin Tổng) điều chỉnh tồn kho sản phẩm "Dưa Lưới Huỳnh Long Ruột Cam VietGAP" tại Chi nhánh 2 - Kho Vận Gò Vấp: từ 24 thành 30 (Lý do: Nhập thêm 6kg dưa lưới từ nhà vườn về chi nhánh Gò Vấp). Tổng tồn hệ thống: 86.', '14.226.251.46', 'Python-urllib/3.11', '2026-11-05 01:43:53');
INSERT INTO `system_logs` (`id`, `user_id`, `action`, `module`, `description`, `ip_address`, `user_agent`, `created_at`) VALUES (383, 33, 'AUTO_REGISTER', 'USER', 'Tự động tạo tài khoản khách hàng khi đặt hàng lần đầu: 0901234567', NULL, NULL, '2026-11-05 01:48:45');
INSERT INTO `system_logs` (`id`, `user_id`, `action`, `module`, `description`, `ip_address`, `user_agent`, `created_at`) VALUES (384, 33, 'CREATE', 'ORDER', 'Tạo đơn hàng mới mã OD202611052409 tổng tiền 175.000 đ', NULL, NULL, '2026-11-05 01:48:46');

-- --------------------------------------------------------
-- Table structure for table `system_settings`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `system_settings`;
CREATE TABLE `system_settings` (
  `setting_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `setting_value` text COLLATE utf8mb4_unicode_ci,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table `system_settings`
INSERT INTO `system_settings` (`setting_key`, `setting_value`, `updated_at`) VALUES ('company_address', '53 Võ Văn Ngân', '2026-11-05 00:39:06');
INSERT INTO `system_settings` (`setting_key`, `setting_value`, `updated_at`) VALUES ('contact_email', 'tranvukuroko@gmail.com', '2026-11-05 00:39:06');
INSERT INTO `system_settings` (`setting_key`, `setting_value`, `updated_at`) VALUES ('default_shipping_fee', '25000', '2026-11-04 17:38:46');
INSERT INTO `system_settings` (`setting_key`, `setting_value`, `updated_at`) VALUES ('exchange_policy', '', '2026-11-04 17:38:46');
INSERT INTO `system_settings` (`setting_key`, `setting_value`, `updated_at`) VALUES ('freeship_threshold', '500000', '2026-11-04 17:38:46');
INSERT INTO `system_settings` (`setting_key`, `setting_value`, `updated_at`) VALUES ('hotline', '0929894248', '2026-11-05 00:38:52');
INSERT INTO `system_settings` (`setting_key`, `setting_value`, `updated_at`) VALUES ('logo_url', '/uploads/1793839122663-13984-brand-logo-1793839122566.png', '2026-11-05 00:38:52');
INSERT INTO `system_settings` (`setting_key`, `setting_value`, `updated_at`) VALUES ('privacy_policy', '', '2026-11-04 17:38:46');
INSERT INTO `system_settings` (`setting_key`, `setting_value`, `updated_at`) VALUES ('shipping_partner', 'GreenSM', '2026-11-04 17:38:46');
INSERT INTO `system_settings` (`setting_key`, `setting_value`, `updated_at`) VALUES ('shipping_policy', '', '2026-11-04 17:38:46');
INSERT INTO `system_settings` (`setting_key`, `setting_value`, `updated_at`) VALUES ('site_name', 'Đổ Đống 4 Mùa', '2026-11-04 17:39:51');
INSERT INTO `system_settings` (`setting_key`, `setting_value`, `updated_at`) VALUES ('terms_of_service', '', '2026-11-04 17:38:46');

-- --------------------------------------------------------
-- Table structure for table `user_permissions`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `user_permissions`;
CREATE TABLE `user_permissions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `permission_id` bigint unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_perm` (`user_id`,`permission_id`),
  KEY `permission_id` (`permission_id`),
  CONSTRAINT `user_permissions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `users`
-- --------------------------------------------------------

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `role_id` bigint unsigned NOT NULL COMMENT 'Khóa ngoại tới bảng roles',
  `branch_id` bigint unsigned DEFAULT NULL COMMENT 'Khóa ngoại tới branches (nếu là quản trị chi nhánh)',
  `full_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Họ và tên',
  `phone` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Số điện thoại duy nhất dùng đăng nhập',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Mật khẩu đã mã hóa',
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Địa chỉ mặc định',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1: Hoạt động, 0: Bị khóa',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `remember_token` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_phone_unique` (`phone`),
  KEY `users_role_id_foreign` (`role_id`),
  KEY `users_branch_id_foreign` (`branch_id`),
  CONSTRAINT `users_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE SET NULL,
  CONSTRAINT `users_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý tài khoản người dùng';

-- Dumping data for table `users`
INSERT INTO `users` (`id`, `role_id`, `branch_id`, `full_name`, `phone`, `password`, `address`, `status`, `created_at`, `updated_at`, `remember_token`) VALUES (1, 1, NULL, 'Trần Vũ (Admin Tổng)', '0929894248', '$2b$10$0lxTDX.5KZMRk6PAVphz.eWVUJuhwGB7/r4koEhxZQzscwIf.YDP2', '53 Võ Văn Ngân, Thủ Đức', 1, '2026-10-28 06:30:18', '2026-11-04 17:44:20', NULL);
INSERT INTO `users` (`id`, `role_id`, `branch_id`, `full_name`, `phone`, `password`, `address`, `status`, `created_at`, `updated_at`, `remember_token`) VALUES (32, 3, NULL, 'as', '0123456789', '$2b$10$0lxTDX.5KZMRk6PAVphz.eWVUJuhwGB7/r4koEhxZQzscwIf.YDP2', 'fa', 1, '2026-11-04 17:42:34', '2026-11-04 17:42:34', NULL);
INSERT INTO `users` (`id`, `role_id`, `branch_id`, `full_name`, `phone`, `password`, `address`, `status`, `created_at`, `updated_at`, `remember_token`) VALUES (33, 3, NULL, 'Nguyễn Văn Test Kho', '0901234567', '$2b$10$gD3yLD8xrwL6DJ9UymuS0uirBbOrS8Z2cLOvpaPRs26HL5VQCV4au', '123 Lê Duẩn, Quận 1, TP.HCM', 1, '2026-11-05 01:48:45', '2026-11-05 01:48:45', NULL);

-- --------------------------------------------------------
-- Table structure for table `vietnam_locations`
/*!40014 SET FOREIGN_KEY_CHECKS=1 */;
