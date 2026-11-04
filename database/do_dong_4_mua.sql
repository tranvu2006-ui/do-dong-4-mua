-- MySQL dump 10.13  Distrib 8.4.7, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: do_dong_4_mua
-- ------------------------------------------------------
-- Server version	8.4.7

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `banners`
--

DROP TABLE IF EXISTS `banners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `banners` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tiêu đề banner',
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Đường dẫn ảnh banner',
  `link_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Đường dẫn liên kết khi bấm vào banner',
  `display_order` int NOT NULL DEFAULT '0' COMMENT 'Thứ tự ưu tiên hiển thị',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1: Hiển thị, 0: Ẩn',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý banner khuyến mãi và quảng cáo';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banners`
--

LOCK TABLES `banners` WRITE;
/*!40000 ALTER TABLE `banners` DISABLE KEYS */;
INSERT INTO `banners` VALUES (1,'Lễ Hội Vải Thiều 2026','https://images.unsplash.com/photo-1550258987-190a2d41a8ba','/',0,1,'2026-10-30 19:24:39','2026-10-30 19:24:39'),(2,'Mùa Vải Thiều Bắc Giang','https://images.unsplash.com/photo-1550258987-190a2d41a8ba','/',0,1,'2026-10-30 19:26:02','2026-10-30 19:26:02'),(3,'Mùa Vải Thiều Bắc Giang','https://images.unsplash.com/photo-1550258987-190a2d41a8ba','/',0,1,'2026-10-30 19:28:11','2026-10-30 19:28:11'),(4,'Mùa Vải Thiều Bắc Giang','https://images.unsplash.com/photo-1550258987-190a2d41a8ba','/',0,1,'2026-10-30 19:28:29','2026-10-30 19:28:29'),(5,'Mùa Vải Thiều Bắc Giang','https://images.unsplash.com/photo-1550258987-190a2d41a8ba','/',0,1,'2026-10-30 19:28:44','2026-10-30 19:28:44'),(6,'Mùa Vải Thiều Bắc Giang','https://images.unsplash.com/photo-1550258987-190a2d41a8ba','/',0,1,'2026-10-30 19:30:42','2026-10-30 19:30:42'),(7,'Mùa Vải Thiều Bắc Giang','https://images.unsplash.com/photo-1550258987-190a2d41a8ba','/',0,1,'2026-10-30 19:35:19','2026-10-30 19:35:19'),(8,'Mùa Vải Thiều Bắc Giang','https://images.unsplash.com/photo-1550258987-190a2d41a8ba','/',0,1,'2026-10-30 19:38:46','2026-10-30 19:38:46'),(9,'Mùa Vải Thiều Bắc Giang','https://images.unsplash.com/photo-1550258987-190a2d41a8ba','/',0,1,'2026-10-30 19:41:47','2026-10-30 19:41:47'),(10,'Đại Tiệc Nông Sản Mùa Thu','https://images.unsplash.com/photo-1542838132-92c53300491e','/products',0,1,'2026-10-30 19:46:59','2026-10-30 19:46:59'),(11,'Đại Tiệc Nông Sản Mùa Thu','https://images.unsplash.com/photo-1542838132-92c53300491e','/products',0,1,'2026-10-30 19:48:56','2026-10-30 19:48:56'),(12,'Đại Tiệc Nông Sản Mùa Thu','https://images.unsplash.com/photo-1542838132-92c53300491e','/products',0,1,'2026-10-30 19:49:32','2026-10-30 19:49:32'),(13,'Đại Tiệc Nông Sản Mùa Thu','https://images.unsplash.com/photo-1542838132-92c53300491e','/products',0,1,'2026-10-30 19:49:59','2026-10-30 19:49:59'),(14,'Đại Tiệc Nông Sản Mùa Thu','https://images.unsplash.com/photo-1542838132-92c53300491e','/products',0,1,'2026-10-30 19:55:26','2026-10-30 19:55:26'),(15,'Mùa Vải Thiều Bắc Giang','https://images.unsplash.com/photo-1550258987-190a2d41a8ba','/',0,1,'2026-10-30 19:55:33','2026-10-30 19:55:33');
/*!40000 ALTER TABLE `banners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `branches`
--

DROP TABLE IF EXISTS `branches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `branches` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `branch_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên chi nhánh',
  `phone` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Số điện thoại chi nhánh',
  `address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Địa chỉ chi nhánh',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1: Hoạt động, 0: Tạm đóng',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `branches_status_index` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý danh sách chi nhánh';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branches`
--

LOCK TABLES `branches` WRITE;
/*!40000 ALTER TABLE `branches` DISABLE KEYS */;
INSERT INTO `branches` VALUES (1,'Chi Nhánh Bình Thạnh Hub','0901234567','53 Võ Văn Ngân, TP. Thủ Đức, TP.HCM',1,'2026-10-28 06:30:18','2026-10-30 19:24:38'),(2,'Chi Nhánh Bình Thạnh','0909112233','123 Xô Viết Nghệ Tĩnh',1,'2026-10-30 19:24:38','2026-10-30 19:24:38'),(3,'Chi Nhánh Bình Thạnh','0909112233','123 Xô Viết Nghệ Tĩnh',1,'2026-10-30 19:26:01','2026-10-30 19:26:01'),(4,'Chi Nhánh Bình Thạnh','0909112233','123 Xô Viết Nghệ Tĩnh',1,'2026-10-30 19:28:11','2026-10-30 19:28:11'),(5,'Chi Nhánh Bình Thạnh','0909112233','123 Xô Viết Nghệ Tĩnh',1,'2026-10-30 19:28:29','2026-10-30 19:28:29'),(6,'Chi Nhánh Bình Thạnh','0909112233','123 Xô Viết Nghệ Tĩnh',1,'2026-10-30 19:28:44','2026-10-30 19:28:44'),(7,'Chi Nhánh Bình Thạnh','0909112233','123 Xô Viết Nghệ Tĩnh',1,'2026-10-30 19:30:42','2026-10-30 19:30:42'),(8,'Chi Nhánh Bình Thạnh','0909112233','123 Xô Viết Nghệ Tĩnh',1,'2026-10-30 19:35:19','2026-10-30 19:35:19'),(9,'Chi Nhánh Bình Thạnh','0909112233','123 Xô Viết Nghệ Tĩnh',1,'2026-10-30 19:38:46','2026-10-30 19:38:46'),(10,'Chi Nhánh Bình Thạnh','0909112233','123 Xô Viết Nghệ Tĩnh',1,'2026-10-30 19:41:47','2026-10-30 19:41:47'),(11,'Chi Nhánh Phan Xích Long Phú Nhuận','0283838383','120 Phan Xích Long',1,'2026-10-30 19:46:58','2026-10-30 19:46:58'),(12,'Chi Nhánh Phan Xích Long Phú Nhuận','0283838383','120 Phan Xích Long',1,'2026-10-30 19:48:56','2026-10-30 19:48:56'),(13,'Chi Nhánh Phan Xích Long Phú Nhuận','0283838383','120 Phan Xích Long',1,'2026-10-30 19:49:32','2026-10-30 19:49:32'),(14,'Chi Nhánh Phan Xích Long Phú Nhuận','0283838383','120 Phan Xích Long',1,'2026-10-30 19:49:59','2026-10-30 19:49:59'),(15,'Chi Nhánh Phan Xích Long Phú Nhuận','0283838383','120 Phan Xích Long',1,'2026-10-30 19:55:26','2026-10-30 19:55:26'),(16,'Chi Nhánh Bình Thạnh','0909112233','123 Xô Viết Nghệ Tĩnh',1,'2026-10-30 19:55:32','2026-10-30 19:55:32');
/*!40000 ALTER TABLE `branches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (1,1,'2026-10-30 19:13:02','2026-10-30 19:13:02',1);
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên danh mục',
  `slug` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Đường dẫn tĩnh SEO',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT 'Mô tả danh mục',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1: Hiển thị, 0: Ẩn',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_slug_unique` (`slug`),
  KEY `categories_status_index` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Danh mục sản phẩm trái cây';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Trái cây tươi','trai-cay-tuoi','Các loại trái cây tươi ngon theo mùa vụ, đạt chuẩn VietGAP và nhập khẩu cao cấp.',1,'2026-10-28 07:02:31','2026-11-01 02:57:56'),(2,'Combo trái cây','combo-trai-cay','Gói kết hợp nhiều loại trái cây ăn gia đình, văn phòng với giá ưu đãi.',1,'2026-10-30 19:24:31','2026-11-01 02:57:57'),(4,'Giỏ quà trái cây','gio-qua-trai-cay','Giỏ quà biếu tặng sang trọng, thiết kế theo mẫu cố định chuẩn chất lượng cao.',1,'2026-10-30 19:28:10','2026-11-01 02:57:57');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_details`
--

DROP TABLE IF EXISTS `order_details`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Chi tiết các món trong đơn hàng';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_details`
--

LOCK TABLES `order_details` WRITE;
/*!40000 ALTER TABLE `order_details` DISABLE KEYS */;
INSERT INTO `order_details` VALUES (1,2,4,2,90000.00,180000.00,'2026-10-30 19:28:06','2026-10-30 19:55:10',180000.00),(2,3,4,2,90000.00,180000.00,'2026-10-30 19:28:10','2026-10-30 19:55:10',180000.00),(3,4,4,2,90000.00,180000.00,'2026-10-30 19:28:28','2026-10-30 19:55:10',180000.00),(4,5,4,2,90000.00,180000.00,'2026-10-30 19:28:43','2026-10-30 19:55:10',180000.00),(5,6,4,2,90000.00,180000.00,'2026-10-30 19:30:41','2026-10-30 19:55:10',180000.00),(6,7,4,2,90000.00,180000.00,'2026-10-30 19:35:18','2026-10-30 19:55:10',180000.00),(7,8,4,2,90000.00,180000.00,'2026-10-30 19:38:41','2026-10-30 19:55:10',180000.00),(8,9,4,2,90000.00,180000.00,'2026-10-30 19:41:46','2026-10-30 19:55:10',180000.00),(9,10,4,2,90000.00,180000.00,'2026-10-30 19:46:53','2026-10-30 19:55:10',180000.00),(10,11,4,2,90000.00,180000.00,'2026-10-30 19:48:53','2026-10-30 19:55:10',180000.00),(11,12,4,2,90000.00,180000.00,'2026-10-30 19:49:30','2026-10-30 19:55:10',180000.00),(12,13,4,2,90000.00,180000.00,'2026-10-30 19:49:58','2026-10-30 19:55:10',180000.00),(13,14,4,2,90000.00,180000.00,'2026-10-30 19:55:25','2026-10-30 19:55:25',NULL),(14,15,4,2,90000.00,180000.00,'2026-10-30 19:55:32','2026-10-30 19:55:32',NULL),(15,16,23,1,1790.00,1790.00,'2026-11-01 04:14:56','2026-11-01 04:14:56',NULL),(16,17,25,120,35000.00,4200000.00,'2026-11-01 21:15:34','2026-11-01 21:15:34',NULL),(17,18,24,2,75000.00,150000.00,'2026-11-01 21:42:39','2026-11-01 21:42:39',NULL),(18,19,24,2,75000.00,150000.00,'2026-11-01 21:48:35','2026-11-01 21:48:35',NULL),(19,20,24,1,75000.00,75000.00,'2026-11-01 22:23:26','2026-11-01 22:23:26',NULL),(20,21,24,1,75000.00,75000.00,'2026-11-01 23:54:36','2026-11-01 23:54:36',NULL),(21,22,24,1,75000.00,75000.00,'2026-11-02 00:22:11','2026-11-02 00:22:11',NULL),(22,23,24,1,75000.00,75000.00,'2026-11-02 00:25:14','2026-11-02 00:25:14',NULL),(23,24,24,1,75000.00,75000.00,'2026-11-02 00:25:58','2026-11-02 00:25:58',NULL);
/*!40000 ALTER TABLE `order_details` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_code` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Mã đơn dạng OD...',
  `user_id` bigint unsigned NOT NULL COMMENT 'Khách hàng đặt mua',
  `receiver_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên người nhận hàng',
  `phone` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'SĐT người nhận',
  `address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Địa chỉ giao hàng',
  `note` text COLLATE utf8mb4_unicode_ci COMMENT 'Ghi chú giao hàng',
  `subtotal` decimal(15,2) NOT NULL DEFAULT '0.00' COMMENT 'Tiền hàng',
  `shipping_fee` decimal(15,2) NOT NULL DEFAULT '0.00' COMMENT 'Phí vận chuyển',
  `total_amount` decimal(15,2) NOT NULL DEFAULT '0.00' COMMENT 'Tổng thanh toán',
  `payment_status` enum('UNPAID','PAID') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'UNPAID' COMMENT 'Trạng thái thanh toán',
  `order_status` enum('CHO_THANH_TOAN','CHO_XAC_NHAN','DA_XAC_NHAN','DANG_CHUAN_BI','TAM_DUNG','DANG_GIAO','DA_GIAO','DA_HUY') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CHO_XAC_NHAN' COMMENT 'Vòng đời 8 trạng thái',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `orders_order_code_unique` (`order_code`),
  KEY `orders_user_id_foreign` (`user_id`),
  KEY `orders_order_status_index` (`order_status`),
  CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý thông tin đơn hàng';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'OD202610303439',1,'Nguyễn Văn Test','0929894248','53 Võ Văn Ngân, Thủ Đức','',180000.00,25000.00,205000.00,'UNPAID','DANG_GIAO','2026-10-30 19:26:01','2026-10-30 19:26:01'),(2,'OD202610301157',1,'Nguyễn Văn Test','0929894248','53 Võ Văn Ngân, Thủ Đức','',180000.00,25000.00,205000.00,'UNPAID','CHO_XAC_NHAN','2026-10-30 19:28:06','2026-10-30 19:28:06'),(3,'OD202610304314',1,'Nguyễn Văn Test','0929894248','53 Võ Văn Ngân, Thủ Đức','',180000.00,25000.00,205000.00,'','DANG_GIAO','2026-10-30 19:28:10','2026-10-30 19:28:10'),(4,'OD202610309287',1,'Nguyễn Văn Test','0929894248','53 Võ Văn Ngân, Thủ Đức','',180000.00,25000.00,205000.00,'','DANG_GIAO','2026-10-30 19:28:28','2026-10-30 19:28:28'),(5,'OD202610307160',1,'Nguyễn Văn Test','0929894248','53 Võ Văn Ngân, Thủ Đức','',180000.00,25000.00,205000.00,'','DANG_GIAO','2026-10-30 19:28:43','2026-10-30 19:28:44'),(6,'OD202610301844',1,'Nguyễn Văn Test','0929894248','53 Võ Văn Ngân, Thủ Đức','',180000.00,25000.00,205000.00,'','DANG_GIAO','2026-10-30 19:30:41','2026-10-30 19:30:41'),(7,'OD202610309798',1,'Nguyễn Văn Test','0929894248','53 Võ Văn Ngân, Thủ Đức','',180000.00,25000.00,205000.00,'','DANG_GIAO','2026-10-30 19:35:18','2026-10-30 19:35:19'),(8,'OD202610304952',1,'Nguyễn Văn Test','0929894248','53 Võ Văn Ngân, Thủ Đức','',180000.00,25000.00,205000.00,'','DANG_GIAO','2026-10-30 19:38:41','2026-10-30 19:38:44'),(9,'OD202610305819',1,'Nguyễn Văn Test','0929894248','53 Võ Văn Ngân, Thủ Đức','',180000.00,25000.00,205000.00,'','DANG_GIAO','2026-10-30 19:41:46','2026-10-30 19:41:46'),(10,'OD202610305326',1,'Nguyễn Văn Test','0929894248','53 Võ Văn Ngân, TP. Thủ Đức','',180000.00,25000.00,205000.00,'','DANG_GIAO','2026-10-30 19:46:53','2026-10-30 19:46:56'),(11,'OD202610303086',1,'Nguyễn Văn Test','0929894248','53 Võ Văn Ngân, TP. Thủ Đức','',180000.00,25000.00,205000.00,'','DANG_GIAO','2026-10-30 19:48:53','2026-10-30 19:48:53'),(12,'OD202610302540',1,'Nguyễn Văn Test','0929894248','53 Võ Văn Ngân, TP. Thủ Đức','',180000.00,25000.00,205000.00,'','DANG_GIAO','2026-10-30 19:49:30','2026-10-30 19:49:31'),(13,'OD202610302117',1,'Nguyễn Văn Test','0929894248','53 Võ Văn Ngân, TP. Thủ Đức','',180000.00,25000.00,205000.00,'','DANG_GIAO','2026-10-30 19:49:58','2026-10-30 19:49:58'),(14,'OD202610301630',1,'Nguyễn Văn Test','0929894248','53 Võ Văn Ngân, TP. Thủ Đức','',180000.00,25000.00,205000.00,'','DANG_GIAO','2026-10-30 19:55:25','2026-10-30 19:55:25'),(15,'OD202610308406',1,'Nguyễn Văn Test','0929894248','53 Võ Văn Ngân, Thủ Đức','',180000.00,25000.00,205000.00,'','DA_GIAO','2026-10-30 19:55:32','2026-10-30 22:36:39'),(16,'OD202611014933',22,'ư','0987654321','ư','',1790.00,25000.00,26790.00,'PAID','CHO_XAC_NHAN','2026-11-01 04:14:56','2026-11-01 04:14:56'),(17,'OD202611015068',23,'s','a','q','',4200000.00,0.00,4200000.00,'PAID','DA_HUY','2026-11-01 21:15:34','2026-11-01 21:16:53'),(18,'OD202611014343',25,'Khách Test SRS','0983569359','456 Kha Vạn Cân, TP Thủ Đức','[Gửi quà tặng - SĐT người nhận: 0912345678] Giao buổi sáng',150000.00,25000.00,175000.00,'PAID','DA_HUY','2026-11-01 21:42:39','2026-11-01 21:42:39'),(19,'OD202611019437',26,'e','0987654311','f','',150000.00,25000.00,175000.00,'PAID','CHO_XAC_NHAN','2026-11-01 21:48:35','2026-11-01 21:48:35'),(20,'OD202611019111',29,'Test Auto Customer','0911172198','123 Đường Số 9, P. Linh Chiểu, TP. Thủ Đức','Giao giờ hành chính',75000.00,25000.00,100000.00,'UNPAID','CHO_XAC_NHAN','2026-11-01 22:23:26','2026-11-01 22:23:26'),(21,'OD202611015516',31,'Vu khoa','0123456789','HCM','',75000.00,25000.00,100000.00,'PAID','DA_HUY','2026-11-01 23:54:36','2026-11-02 00:21:59'),(22,'OD202611021042',31,'Vu khoa','0123456789','HCM','',75000.00,25000.00,100000.00,'UNPAID','CHO_XAC_NHAN','2026-11-02 00:22:11','2026-11-02 00:23:25'),(23,'OD202611026281',31,'Vu khoa','0123456789','HCM','',75000.00,25000.00,100000.00,'UNPAID','CHO_XAC_NHAN','2026-11-02 00:25:13','2026-11-02 00:25:13'),(24,'OD202611021177',31,'Vu khoa','0123456789','HCM','',75000.00,25000.00,100000.00,'UNPAID','CHO_XAC_NHAN','2026-11-02 00:25:58','2026-11-02 00:25:58');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL,
  `payment_method` enum('COD','VIETQR','MOMO') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'COD' COMMENT 'Phương thức',
  `transaction_code` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Mã giao dịch ngân hàng/ví',
  `amount` decimal(15,2) NOT NULL DEFAULT '0.00' COMMENT 'Số tiền thanh toán',
  `status` enum('PENDING','PAID','FAILED') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'PENDING' COMMENT 'Trạng thái',
  `payment_time` datetime DEFAULT NULL COMMENT 'Thời gian thanh toán',
  `details` text COLLATE utf8mb4_unicode_ci COMMENT 'Phản hồi từ cổng thanh toán',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `payment_amount` decimal(12,2) DEFAULT NULL,
  `payment_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `note` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `payments_order_id_unique` (`order_id`),
  KEY `payments_transaction_code_index` (`transaction_code`),
  CONSTRAINT `payments_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Lịch sử và trạng thái thanh toán';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (1,1,'','PAY-1793388361471',44126.00,'',NULL,NULL,'2026-10-30 19:26:01','2026-10-30 19:55:10',44126.00,'',NULL),(2,2,'COD',NULL,205000.00,'PENDING',NULL,NULL,'2026-10-30 19:28:06','2026-10-30 19:55:10',205000.00,'PENDING',NULL),(3,3,'COD','TRANS-9988',205000.00,'','2026-10-31 02:28:10',NULL,'2026-10-30 19:28:10','2026-10-30 19:55:10',205000.00,'',NULL),(5,4,'','TRANS-9988',44126.00,'','2026-10-31 02:28:28',NULL,'2026-10-30 19:28:28','2026-10-30 19:55:10',44126.00,'',NULL),(7,5,'','TRANS-9988',44126.00,'','2026-10-31 02:28:44',NULL,'2026-10-30 19:28:43','2026-10-30 19:55:10',44126.00,'',NULL),(9,6,'','TRANS-9988',44126.00,'','2026-10-31 02:30:41',NULL,'2026-10-30 19:30:41','2026-10-30 19:55:10',44126.00,'',NULL),(11,7,'','TRANS-9988',44126.00,'','2026-10-31 02:35:19',NULL,'2026-10-30 19:35:18','2026-10-30 19:55:10',44126.00,'',NULL),(13,8,'','TRANS-9988',44126.00,'','2026-10-31 02:38:44',NULL,'2026-10-30 19:38:41','2026-10-30 19:55:10',44126.00,'',NULL),(15,9,'','TRANS-9988',44126.00,'','2026-10-31 02:41:46',NULL,'2026-10-30 19:41:46','2026-10-30 19:55:10',44126.00,'',NULL),(17,10,'MOMO','MOMO9988',44126.00,'','2026-10-31 02:46:56',NULL,'2026-10-30 19:46:53','2026-10-30 19:55:10',44126.00,'',NULL),(19,11,'MOMO','MOMO9988',44126.00,'','2026-10-31 02:48:53',NULL,'2026-10-30 19:48:53','2026-10-30 19:55:10',44126.00,'',NULL),(21,12,'MOMO','MOMO9988',44126.00,'','2026-10-31 02:49:31',NULL,'2026-10-30 19:49:30','2026-10-30 19:55:10',44126.00,'',NULL),(23,13,'MOMO','MOMO9988',44126.00,'','2026-10-31 02:49:58',NULL,'2026-10-30 19:49:58','2026-10-30 19:55:10',44126.00,'',NULL),(25,14,'MOMO','MOMO9988',44126.00,'','2026-10-31 02:55:25',NULL,'2026-10-30 19:55:25','2026-10-30 19:55:25',NULL,NULL,NULL),(27,15,'','TRANS-9988',44126.00,'','2026-10-31 02:55:32',NULL,'2026-10-30 19:55:32','2026-10-30 19:55:32',NULL,NULL,NULL),(29,16,'VIETQR','VIETQR20261101755774',26790.00,'PAID','2026-11-01 11:14:56',NULL,'2026-11-01 04:14:56','2026-11-01 04:14:56',NULL,NULL,NULL),(30,17,'VIETQR','VIETQR20261101126727',4200000.00,'PAID','2026-11-02 04:15:34',NULL,'2026-11-01 21:15:34','2026-11-01 21:15:34',NULL,NULL,NULL),(31,18,'VIETQR','VIETQR20261101507045',175000.00,'PAID','2026-11-02 04:42:40',NULL,'2026-11-01 21:42:39','2026-11-01 21:42:39',NULL,NULL,NULL),(32,19,'VIETQR','VIETQR20261101713289',175000.00,'PAID','2026-11-02 04:48:36',NULL,'2026-11-01 21:48:35','2026-11-01 21:48:35',NULL,NULL,NULL),(33,20,'COD',NULL,100000.00,'PENDING',NULL,NULL,'2026-11-01 22:23:26','2026-11-01 22:23:26',NULL,NULL,NULL),(34,21,'MOMO','MOMO20261101691409',100000.00,'PAID','2026-11-02 06:54:36',NULL,'2026-11-01 23:54:36','2026-11-01 23:54:36',NULL,NULL,NULL),(35,22,'VIETQR','VIETQR20261102665699',100000.00,'PENDING',NULL,NULL,'2026-11-02 00:22:11','2026-11-02 00:23:25',NULL,'UNPAID',NULL),(36,23,'VIETQR','VIETQR20261102401345',100000.00,'PENDING',NULL,NULL,'2026-11-02 00:25:14','2026-11-02 00:25:14',NULL,NULL,NULL),(37,24,'VIETQR','VIETQR20261102677316',100000.00,'PENDING',NULL,NULL,'2026-11-02 00:25:58','2026-11-02 00:25:58',NULL,NULL,NULL);
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `permission_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên quyền',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT 'Mô tả quyền',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissions_permission_name_unique` (`permission_name`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Danh mục quyền hệ thống';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (1,'product.view','Xem danh sách sản phẩm','2026-10-30 19:08:32','2026-10-30 19:08:32'),(2,'product.create','Thêm sản phẩm mới','2026-10-30 19:08:32','2026-10-30 19:08:32'),(3,'product.update','Cập nhật thông tin sản phẩm','2026-10-30 19:08:32','2026-10-30 19:08:32'),(4,'product.delete','Xóa sản phẩm','2026-10-30 19:08:32','2026-10-30 19:08:32'),(5,'category.manage','Quản lý danh mục mùa vụ','2026-10-30 19:08:32','2026-10-30 19:08:32'),(6,'order.view','Xem danh sách đơn hàng','2026-10-30 19:08:32','2026-10-30 19:08:32'),(7,'order.update','Cập nhật trạng thái đơn & vận đơn','2026-10-30 19:08:32','2026-10-30 19:08:32'),(8,'order.cancel','Hủy đơn hàng','2026-10-30 19:08:32','2026-10-30 19:08:32'),(9,'shipment.manage','Quản lý vận đơn GreenSM','2026-10-30 19:08:32','2026-10-30 19:08:32'),(10,'promotion.manage','Quản lý chương trình khuyến mãi','2026-10-30 19:08:32','2026-10-30 19:08:32'),(11,'branch.manage','Quản lý chi nhánh','2026-10-30 19:08:32','2026-10-30 19:08:32'),(12,'banner.manage','Quản lý banner quảng cáo','2026-10-30 19:08:32','2026-10-30 19:08:32'),(13,'report.view','Xem báo cáo doanh thu','2026-10-30 19:08:32','2026-10-30 19:08:32'),(14,'user.manage','Quản lý tài khoản quản trị','2026-10-30 19:08:32','2026-10-30 19:08:32'),(15,'system.log','Xem nhật ký hệ thống','2026-10-30 19:08:32','2026-10-30 19:08:32'),(16,'inventory.manage','Quản lý tồn kho trái cây chi nhánh','2026-11-01 01:54:43','2026-11-01 01:57:07'),(17,'customer.view','Quản lý danh sách khách hàng','2026-11-01 01:54:43','2026-11-01 01:57:07'),(18,'payment.confirm','Quản lý và xác nhận thanh toán','2026-11-01 01:54:43','2026-11-01 01:57:07');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL COMMENT 'Sản phẩm tương ứng',
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Đường dẫn ảnh',
  `display_order` int NOT NULL DEFAULT '0' COMMENT 'Thứ tự hiển thị',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `sort_order` int DEFAULT '1',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `product_images_product_id_foreign` (`product_id`),
  CONSTRAINT `product_images_product_id_foreign` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bộ sưu tập ảnh chi tiết sản phẩm';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (18,23,'/uploads/1793504691797-59230-Screenshot_2026-09-22_080621.png',1,'2026-11-01 03:44:51',1,'2026-11-01 03:44:51'),(19,23,'/uploads/1793504693944-52209-Screenshot_2026-09-22_103021.png',2,'2026-11-01 03:44:53',1,'2026-11-01 03:44:53'),(20,23,'/uploads/1793504696750-76699-Screenshot_2026-09-22_103123.png',3,'2026-11-01 03:44:56',1,'2026-11-01 03:44:56');
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `category_id` bigint unsigned NOT NULL COMMENT 'Khóa ngoại danh mục',
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên sản phẩm',
  `slug` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Đường dẫn tĩnh SEO',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT 'Mô tả chi tiết',
  `price` decimal(15,2) NOT NULL DEFAULT '0.00' COMMENT 'Giá gốc',
  `discount_price` decimal(15,2) DEFAULT NULL COMMENT 'Giá khuyến mãi nếu có',
  `unit` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'kg' COMMENT 'Đơn vị tính (kg, giỏ, combo)',
  `stock` int NOT NULL DEFAULT '0' COMMENT 'Số lượng tồn kho',
  `thumbnail` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Ảnh đại diện chính',
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (4,1,'Xoài Cát Hòa Lộc Loại 1','bun-3907','',90000.00,NULL,'kg',93,'/uploads/1793171557137-55913-Screenshot_2026-09-29_082725.png',1,1,'2026-10-28 07:12:53','2026-10-30 19:55:32'),(5,1,'Xoài Cát Hòa Lộc Tiền Giang','xoai-cat-hoa-loc-tien-giang-0026','Xoài cát chín cây thơm lừng đạt chuẩn VietGAP',85000.00,75000.00,'kg',120,'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop&q=80',0,1,'2026-10-30 19:24:30','2026-10-30 19:24:30'),(6,1,'Xoài Cát Hòa Lộc Tiền Giang','xoai-cat-hoa-loc-tien-giang-0625','Xoài cát chín cây thơm lừng đạt chuẩn VietGAP',85000.00,75000.00,'kg',120,'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop&q=80',0,1,'2026-10-30 19:26:00','2026-10-30 19:26:00'),(7,1,'Xoài Cát Hòa Lộc Tiền Giang','xoai-cat-hoa-loc-tien-giang-0118','Xoài cát chín cây thơm lừng đạt chuẩn VietGAP',85000.00,75000.00,'kg',120,'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop&q=80',0,1,'2026-10-30 19:28:10','2026-10-30 19:28:10'),(8,1,'Xoài Cát Hòa Lộc Tiền Giang','xoai-cat-hoa-loc-tien-giang-7983','Xoài cát chín cây thơm lừng đạt chuẩn VietGAP',85000.00,75000.00,'kg',120,'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop&q=80',0,1,'2026-10-30 19:28:27','2026-10-30 19:28:27'),(9,1,'Xoài Cát Hòa Lộc Tiền Giang','xoai-cat-hoa-loc-tien-giang-3426','Xoài cát chín cây thơm lừng đạt chuẩn VietGAP',85000.00,75000.00,'kg',120,'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop&q=80',0,1,'2026-10-30 19:28:43','2026-10-30 19:28:43'),(10,1,'Xoài Cát Hòa Lộc Tiền Giang','xoai-cat-hoa-loc-tien-giang-1003','Xoài cát chín cây thơm lừng đạt chuẩn VietGAP',85000.00,NULL,'kg',120,'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop&q=80',0,1,'2026-10-30 19:30:41','2026-11-01 04:40:13'),(11,1,'Xoài Cát Hòa Lộc Tiền Giang','xoai-cat-hoa-loc-tien-giang-7259','Xoài cát chín cây thơm lừng đạt chuẩn VietGAP',85000.00,NULL,'kg',120,'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop&q=80',0,1,'2026-10-30 19:35:17','2026-11-01 04:40:13'),(12,1,'Xoài Cát Hòa Lộc Tiền Giang','xoai-cat-hoa-loc-tien-giang-6958','Xoài cát chín cây thơm lừng đạt chuẩn VietGAP',85000.00,75000.00,'kg',120,'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop&q=80',0,1,'2026-10-30 19:38:36','2026-10-30 19:38:36'),(13,1,'Xoài Cát Hòa Lộc Tiền Giang','xoai-cat-hoa-loc-tien-giang-5979','Xoài cát chín cây thơm lừng đạt chuẩn VietGAP',85000.00,75000.00,'kg',120,'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop&q=80',0,1,'2026-10-30 19:41:45','2026-10-30 19:41:45'),(14,1,'Táo Envy New Zealand Hạng 1','tao-envy-chuan-vietgap-7883','',125000.00,NULL,'kg',500,'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop&q=80',0,1,'2026-10-30 19:46:47','2026-10-30 19:46:49'),(15,1,'Táo Envy New Zealand Hạng 1','tao-envy-chuan-vietgap-2465-2494','',125000.00,NULL,'kg',500,'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop&q=80',0,1,'2026-10-30 19:48:52','2026-10-30 19:48:52'),(16,1,'Táo Envy New Zealand Hạng 1','tao-envy-chuan-vietgap-9958-9974','',125000.00,NULL,'kg',500,'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop&q=80',0,1,'2026-10-30 19:49:29','2026-10-30 19:49:30'),(17,1,'Táo Envy New Zealand Hạng 1','tao-envy-chuan-vietgap-8047-8062','',125000.00,NULL,'kg',500,'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop&q=80',0,1,'2026-10-30 19:49:58','2026-10-30 19:49:58'),(18,1,'Táo Envy New Zealand Hạng 1','tao-envy-chuan-vietgap-4661-4675','',125000.00,NULL,'kg',500,'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop&q=80',0,1,'2026-10-30 19:55:24','2026-10-30 19:55:24'),(19,1,'Xoài Cát Hòa Lộc Tiền Giang','xoai-cat-hoa-loc-tien-giang-1562','Xoài cát chín cây thơm lừng đạt chuẩn VietGAP',85000.00,75000.00,'kg',120,'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop&q=80',0,1,'2026-10-30 19:55:31','2026-10-30 19:55:31'),(21,4,'Giỏ Quà Trái Cây Tài Lộc Mẫu 01','gio-qua-trai-cay-tai-loc-mau-01','Mẫu giỏ quà sang trọng cố định: 1 Dưa lưới Huỳnh Long, 2 Táo Envy, 1 Chùm Nho Mẫu Đơn, kèm ruy băng cao cấp.',550000.00,499000.00,'giỏ',20,'https://images.unsplash.com/photo-1546548970-71785318a17b?w=600',1,1,'2026-11-01 02:34:29','2026-11-01 03:35:37'),(22,1,'Sầu Riêng Ri6 Cai Lậy (Tạm hết hàng)','sau-rieng-ri6-cai-lay','Sầu riêng Ri6 cơm vàng hạt lép Cai Lậy, đang tạm hết hàng mùa vụ.',140000.00,NULL,'kg',0,'https://images.unsplash.com/photo-1587334274328-64186a80aeee?w=600',0,1,'2026-11-01 02:34:29','2026-11-01 03:35:37'),(23,2,'Combo Trái Cây Gia Đình 3 Món','combo-trai-cay-gia-inh-3-mon-5346','Combo tiết kiệm gồm 1kg Xoài Cát Hòa Lộc, 1kg Táo Envy và 500g Nho Mẫu Đơn.',199000.00,159000.00,'combo',0,'/uploads/1793506413392-95704-Screenshot_2026-09-22_104714.png',1,1,'2026-11-01 03:13:55','2026-11-01 17:38:56'),(24,1,'Dưa Lưới Huỳnh Long Ruột Cam VietGAP','dua-luoi-huynh-long-vietgap','Dưa lưới Huỳnh Long chuẩn VietGAP, ruột cam giòn ngọt đậm đà, thơm mát thanh nhiệt mùa Hạ.',85000.00,75000.00,'kg',44,'/uploads/1793504710921-42412-Screenshot_2026-09-22_080629.png',1,1,'2026-11-01 17:54:56','2026-11-02 00:25:58'),(25,1,'Dưa Hấu Không Hạt Mặt Trời Đỏ','dua-hau-khong-hat-mat-troi-do','Dưa hấu không hạt ruột đỏ mọng nước, vị ngọt thanh mát, giải nhiệt mùa Hạ chuẩn ngon.',35000.00,NULL,'kg',0,'/uploads/1793504693944-52209-Screenshot_2026-09-22_103021.png',0,0,'2026-11-01 17:54:56','2026-11-01 21:38:46');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promotion_products`
--

DROP TABLE IF EXISTS `promotion_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotion_products`
--

LOCK TABLES `promotion_products` WRITE;
/*!40000 ALTER TABLE `promotion_products` DISABLE KEYS */;
INSERT INTO `promotion_products` VALUES (20,18,23);
/*!40000 ALTER TABLE `promotion_products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promotions`
--

DROP TABLE IF EXISTS `promotions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tiêu đề khuyến mãi',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT 'Nội dung chi tiết',
  `discount_percent` decimal(5,2) NOT NULL DEFAULT '0.00' COMMENT 'Phần trăm giảm giá',
  `start_date` datetime NOT NULL COMMENT 'Thời gian bắt đầu',
  `end_date` datetime NOT NULL COMMENT 'Thời gian kết thúc',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1: Hoạt động, 0: Hết hạn/Tắt',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `promotions_status_index` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Chương trình khuyến mãi';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotions`
--

LOCK TABLES `promotions` WRITE;
/*!40000 ALTER TABLE `promotions` DISABLE KEYS */;
INSERT INTO `promotions` VALUES (18,'ga','',20.00,'2026-11-01 07:00:00','2026-11-08 07:00:00',1,'2026-11-01 04:40:54','2026-11-01 17:38:56'),(19,'qẻ','',10.00,'2026-11-01 07:00:00','2026-11-08 07:00:00',1,'2026-11-01 04:41:45','2026-11-01 17:38:50');
/*!40000 ALTER TABLE `promotions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permissions`
--

LOCK TABLES `role_permissions` WRITE;
/*!40000 ALTER TABLE `role_permissions` DISABLE KEYS */;
INSERT INTO `role_permissions` VALUES (1,1,12,'2026-10-30 19:08:32'),(2,1,11,'2026-10-30 19:08:32'),(3,1,5,'2026-10-30 19:08:32'),(4,1,8,'2026-10-30 19:08:32'),(5,1,7,'2026-10-30 19:08:32'),(6,1,6,'2026-10-30 19:08:32'),(7,1,2,'2026-10-30 19:08:32'),(8,1,4,'2026-10-30 19:08:32'),(9,1,3,'2026-10-30 19:08:32'),(10,1,1,'2026-10-30 19:08:32'),(11,1,10,'2026-10-30 19:08:32'),(12,1,13,'2026-10-30 19:08:32'),(13,1,9,'2026-10-30 19:08:32'),(14,1,15,'2026-10-30 19:08:32'),(15,1,14,'2026-10-30 19:08:32'),(75,2,1,'2026-10-30 19:55:33'),(76,2,2,'2026-10-30 19:55:33'),(77,2,6,'2026-10-30 19:55:33'),(78,2,7,'2026-10-30 19:55:33'),(79,2,9,'2026-10-30 19:55:33'),(80,2,13,'2026-10-30 19:55:33');
/*!40000 ALTER TABLE `role_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên vai trò',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT 'Mô tả vai trò',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `roles_role_name_unique` (`role_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Bảng vai trò người dùng';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'Admin Tổng','Quản trị viên toàn quyền hệ thống','2026-10-28 06:30:18','2026-10-28 06:30:18'),(2,'Admin Chi nhánh','Quản lý kho và đơn hàng tại chi nhánh','2026-10-28 06:30:18','2026-10-28 06:30:18'),(3,'Khách hàng','Người mua hàng trực tuyến','2026-10-28 06:30:18','2026-10-28 06:30:18');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shipments`
--

DROP TABLE IF EXISTS `shipments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shipments` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `order_id` bigint unsigned NOT NULL COMMENT 'Đơn hàng vận chuyển',
  `shipping_company` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'GreenSM' COMMENT 'Đơn vị vận chuyển (mặc định GreenSM)',
  `tracking_code` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Mã vận đơn tra cứu',
  `shipping_fee` decimal(15,2) NOT NULL DEFAULT '0.00' COMMENT 'Phí vận chuyển',
  `shipping_status` enum('CHO_TAO_VAN_DON','DA_TAO_VAN_DON','DA_BAN_GIAO_GREENSM','DANG_GIAO','GIAO_THANH_CONG','GIAO_THAT_BAI') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'CHO_TAO_VAN_DON' COMMENT 'Trạng thái vận chuyển',
  `ship_date` datetime DEFAULT NULL COMMENT 'Ngày bàn giao đơn vị vận chuyển',
  `delivery_date` datetime DEFAULT NULL COMMENT 'Ngày giao hàng thành công',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `shipments_order_id_unique` (`order_id`),
  UNIQUE KEY `shipments_tracking_code_unique` (`tracking_code`),
  CONSTRAINT `shipments_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý vận đơn và lộ trình giao hàng';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shipments`
--

LOCK TABLES `shipments` WRITE;
/*!40000 ALTER TABLE `shipments` DISABLE KEYS */;
INSERT INTO `shipments` VALUES (1,1,'GreenSM','GSM-638221',25000.00,'DANG_GIAO','2026-10-31 02:26:01',NULL,'2026-10-30 19:26:01','2026-10-30 19:26:01'),(2,2,'GreenSM','GSM-VN-20261030-1157',25000.00,'DA_TAO_VAN_DON',NULL,NULL,'2026-10-30 19:28:06','2026-10-30 19:28:06'),(3,3,'GreenSM','GSM-844753',25000.00,'DANG_GIAO',NULL,NULL,'2026-10-30 19:28:10','2026-10-30 19:28:11'),(5,4,'GreenSM','GSM-740929',25000.00,'DANG_GIAO',NULL,NULL,'2026-10-30 19:28:28','2026-10-30 19:28:28'),(7,5,'GreenSM','GSM-378703',25000.00,'DANG_GIAO',NULL,NULL,'2026-10-30 19:28:43','2026-10-30 19:28:44'),(9,6,'GreenSM','GSM-504716',25000.00,'DANG_GIAO',NULL,NULL,'2026-10-30 19:30:41','2026-10-30 19:30:42'),(11,7,'GreenSM','GSM-100743',25000.00,'DANG_GIAO',NULL,NULL,'2026-10-30 19:35:18','2026-10-30 19:35:19'),(13,8,'GreenSM','GSM-878928',25000.00,'DANG_GIAO',NULL,NULL,'2026-10-30 19:38:41','2026-10-30 19:38:44'),(15,9,'GreenSM','GSM-532707',25000.00,'DANG_GIAO',NULL,NULL,'2026-10-30 19:41:46','2026-10-30 19:41:46'),(17,10,'GreenSM','GSM-431529',25000.00,'DANG_GIAO',NULL,NULL,'2026-10-30 19:46:53','2026-10-30 19:46:56'),(19,11,'GreenSM','GSM-161294',25000.00,'DANG_GIAO',NULL,NULL,'2026-10-30 19:48:53','2026-10-30 19:48:53'),(21,12,'GreenSM','GSM-368742',25000.00,'DANG_GIAO',NULL,NULL,'2026-10-30 19:49:30','2026-10-30 19:49:31'),(23,13,'GreenSM','GSM-989268',25000.00,'DANG_GIAO',NULL,NULL,'2026-10-30 19:49:58','2026-10-30 19:49:59'),(25,14,'GreenSM','GSM-591781',25000.00,'DANG_GIAO',NULL,NULL,'2026-10-30 19:55:25','2026-10-30 19:55:26'),(27,15,'GreenSM','GSM-811779',25000.00,'GIAO_THANH_CONG',NULL,'2026-10-31 05:36:39','2026-10-30 19:55:32','2026-10-30 22:36:39'),(29,16,'GreenSM','GSM-VN-20261101-4933',25000.00,'DA_TAO_VAN_DON',NULL,NULL,'2026-11-01 04:14:56','2026-11-01 04:14:56'),(30,17,'GreenSM','GSM-VN-20261101-5068',0.00,'GIAO_THAT_BAI',NULL,NULL,'2026-11-01 21:15:34','2026-11-01 21:16:53'),(31,18,'GreenSM','GSM-VN-20261101-4343',25000.00,'GIAO_THAT_BAI',NULL,NULL,'2026-11-01 21:42:39','2026-11-01 21:42:39'),(32,19,'GreenSM','GSM-VN-20261101-9437',25000.00,'DA_TAO_VAN_DON',NULL,NULL,'2026-11-01 21:48:35','2026-11-01 21:48:35'),(33,20,'GreenSM','GSM-VN-20261101-9111',25000.00,'DA_TAO_VAN_DON',NULL,NULL,'2026-11-01 22:23:26','2026-11-01 22:23:26'),(34,21,'GreenSM','GSM-VN-20261101-5516',25000.00,'GIAO_THAT_BAI',NULL,NULL,'2026-11-01 23:54:36','2026-11-02 00:21:59'),(35,22,'GreenSM','GSM-VN-20261102-1042',25000.00,'DA_TAO_VAN_DON',NULL,NULL,'2026-11-02 00:22:11','2026-11-02 00:22:11'),(36,23,'GreenSM','GSM-VN-20261102-6281',25000.00,'DA_TAO_VAN_DON',NULL,NULL,'2026-11-02 00:25:14','2026-11-02 00:25:14'),(37,24,'GreenSM','GSM-VN-20261102-1177',25000.00,'DA_TAO_VAN_DON',NULL,NULL,'2026-11-02 00:25:58','2026-11-02 00:25:58');
/*!40000 ALTER TABLE `shipments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `system_logs`
--

DROP TABLE IF EXISTS `system_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL COMMENT 'Người thực hiện hành động (NULL nếu là khách vãng lai hoặc hệ thống tự động)',
  `action` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Hành động: CREATE, UPDATE, DELETE, LOGIN, EXPORT...',
  `module` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Phân hệ: PRODUCT, ORDER, AUTH, BRANCH...',
  `description` text COLLATE utf8mb4_unicode_ci COMMENT 'Mô tả chi tiết thao tác',
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Địa chỉ IP (hỗ trợ IPv4 & IPv6)',
  `user_agent` text COLLATE utf8mb4_unicode_ci COMMENT 'Thông tin trình duyệt và thiết bị',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Thời điểm ghi nhận nhật ký',
  PRIMARY KEY (`id`),
  KEY `system_logs_user_id_foreign` (`user_id`),
  KEY `system_logs_module_action_index` (`module`,`action`),
  CONSTRAINT `system_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=372 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Nhật ký thao tác và audit log hệ thống';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_logs`
--

LOCK TABLES `system_logs` WRITE;
/*!40000 ALTER TABLE `system_logs` DISABLE KEYS */;
INSERT INTO `system_logs` VALUES (1,1,'CREATE','CATEGORY','Tạo danh mục mới: 2',NULL,NULL,'2026-10-28 07:02:31'),(2,2,'REGISTER','AUTH','Khách hàng mới đăng ký tài khoản SĐT: 0912345678',NULL,NULL,'2026-10-28 09:34:27'),(3,1,'FORGOT_PASSWORD','AUTH','Yêu cầu gửi OTP khôi phục mật khẩu đến SĐT: 0929894248',NULL,NULL,'2026-10-30 19:13:02'),(4,1,'FORGOT_PASSWORD','AUTH','Yêu cầu gửi OTP khôi phục mật khẩu đến SĐT: 0929894248',NULL,NULL,'2026-10-30 19:18:06'),(5,1,'FORGOT_PASSWORD','AUTH','Yêu cầu gửi OTP khôi phục mật khẩu đến SĐT: 0929894248',NULL,NULL,'2026-10-30 19:18:42'),(6,1,'LOGOUT','AUTH','Người dùng đăng xuất khỏi hệ thống (0929894248)',NULL,NULL,'2026-10-30 19:24:28'),(7,1,'FORGOT_PASSWORD','AUTH','Yêu cầu gửi OTP khôi phục mật khẩu đến SĐT: 0929894248',NULL,NULL,'2026-10-30 19:24:28'),(8,1,'RESET_PASSWORD','AUTH','Đặt lại mật khẩu thành công qua xác thực OTP cho SĐT: 0929894248',NULL,NULL,'2026-10-30 19:24:29'),(9,1,'UPDATE_PROFILE','CUSTOMER','Cập nhật thông tin hồ sơ cá nhân',NULL,NULL,'2026-10-30 19:24:29'),(10,1,'CHANGE_PASSWORD','CUSTOMER','Thay đổi mật khẩu thành công',NULL,NULL,'2026-10-30 19:24:29'),(11,1,'CREATE','CATEGORY','Tạo danh mục mới: Trái Cây Mùa Thu Đặc Sản',NULL,NULL,'2026-10-30 19:24:31'),(12,1,'UPDATE_ADMIN','ADMIN','Cập nhật tài khoản quản trị ID 2 (Mở khóa)',NULL,NULL,'2026-10-30 19:24:38'),(13,1,'UPDATE_PERMISSIONS','PERMISSION','Cập nhật phân quyền cho Role ID 2 (6 quyền)',NULL,NULL,'2026-10-30 19:24:39'),(14,1,'UPDATE_SETTINGS','SYSTEM','Cập nhật thông số cấu hình hệ thống website',NULL,NULL,'2026-10-30 19:24:40'),(15,1,'LOGOUT','AUTH','Người dùng đăng xuất khỏi hệ thống (0929894248)',NULL,NULL,'2026-10-30 19:26:00'),(16,1,'FORGOT_PASSWORD','AUTH','Yêu cầu gửi OTP khôi phục mật khẩu đến SĐT: 0929894248',NULL,NULL,'2026-10-30 19:26:00'),(17,1,'RESET_PASSWORD','AUTH','Đặt lại mật khẩu thành công qua xác thực OTP cho SĐT: 0929894248',NULL,NULL,'2026-10-30 19:26:00'),(18,1,'UPDATE_PROFILE','CUSTOMER','Cập nhật thông tin hồ sơ cá nhân',NULL,NULL,'2026-10-30 19:26:00'),(19,1,'CHANGE_PASSWORD','CUSTOMER','Thay đổi mật khẩu thành công',NULL,NULL,'2026-10-30 19:26:00'),(20,1,'CREATE_SHIPMENT','SHIPMENT','Đã kết nối tạo vận đơn GreenSM mã GSM-638221 cho đơn OD202610303439',NULL,NULL,'2026-10-30 19:26:01'),(21,1,'CREATE_ADMIN','ADMIN','Tạo mới tài khoản quản trị: Quản Lý Chi Nhánh Q1 (0977889911) - Chi nhánh 2',NULL,NULL,'2026-10-30 19:26:01'),(22,1,'UPDATE_ADMIN','ADMIN','Cập nhật tài khoản quản trị ID 5 (Mở khóa)',NULL,NULL,'2026-10-30 19:26:01'),(23,1,'DELETE_ADMIN','ADMIN','Xóa tài khoản quản trị ID 5',NULL,NULL,'2026-10-30 19:26:01'),(24,1,'UPDATE_PERMISSIONS','PERMISSION','Cập nhật phân quyền cho Role ID 2 (6 quyền)',NULL,NULL,'2026-10-30 19:26:02'),(25,1,'UPDATE_SETTINGS','SYSTEM','Cập nhật thông số cấu hình hệ thống website',NULL,NULL,'2026-10-30 19:26:02'),(26,1,'CREATE','ORDER','Tạo đơn hàng mới mã OD202610301157 tổng tiền 205.000 đ',NULL,NULL,'2026-10-30 19:28:06'),(27,1,'LOGOUT','AUTH','Người dùng đăng xuất khỏi hệ thống (0929894248)',NULL,NULL,'2026-10-30 19:28:09'),(28,1,'FORGOT_PASSWORD','AUTH','Yêu cầu gửi OTP khôi phục mật khẩu đến SĐT: 0929894248',NULL,NULL,'2026-10-30 19:28:09'),(29,1,'RESET_PASSWORD','AUTH','Đặt lại mật khẩu thành công qua xác thực OTP cho SĐT: 0929894248',NULL,NULL,'2026-10-30 19:28:09'),(30,1,'UPDATE_PROFILE','CUSTOMER','Cập nhật thông tin hồ sơ cá nhân',NULL,NULL,'2026-10-30 19:28:10'),(31,1,'CHANGE_PASSWORD','CUSTOMER','Thay đổi mật khẩu thành công',NULL,NULL,'2026-10-30 19:28:10'),(32,1,'CREATE','CATEGORY','Tạo danh mục mới: Trái Cây Mùa Thu Đặc Sản',NULL,NULL,'2026-10-30 19:28:10'),(33,1,'CREATE','ORDER','Tạo đơn hàng mới mã OD202610304314 tổng tiền 205.000 đ',NULL,NULL,'2026-10-30 19:28:10'),(34,1,'UPDATE_STATUS','ORDER','Cập nhật đơn hàng OD202610304314 sang trạng thái: DANG_CHUAN_BI',NULL,NULL,'2026-10-30 19:28:10'),(35,1,'CANCEL_ORDER','ORDER','Hủy đơn hàng OD202610304314. Lý do: Khách đổi ý muốn đặt món khác',NULL,NULL,'2026-10-30 19:28:10'),(36,1,'PAYMENT_WEBHOOK','PAYMENT','Nhận webhook thanh toán đơn OD202610304314: Thành công',NULL,NULL,'2026-10-30 19:28:10'),(37,1,'CREATE_SHIPMENT','SHIPMENT','Đã kết nối tạo vận đơn GreenSM mã GSM-844753 cho đơn OD202610304314',NULL,NULL,'2026-10-30 19:28:10'),(38,1,'CREATE_ADMIN','ADMIN','Tạo mới tài khoản quản trị: Quản Lý Chi Nhánh Q1 (0977889911) - Chi nhánh 2',NULL,NULL,'2026-10-30 19:28:11'),(39,1,'UPDATE_ADMIN','ADMIN','Cập nhật tài khoản quản trị ID 6 (Mở khóa)',NULL,NULL,'2026-10-30 19:28:11'),(40,1,'DELETE_ADMIN','ADMIN','Xóa tài khoản quản trị ID 6',NULL,NULL,'2026-10-30 19:28:11'),(41,1,'UPDATE_PERMISSIONS','PERMISSION','Cập nhật phân quyền cho Role ID 2 (6 quyền)',NULL,NULL,'2026-10-30 19:28:11'),(42,1,'UPDATE_SETTINGS','SYSTEM','Cập nhật thông số cấu hình hệ thống website',NULL,NULL,'2026-10-30 19:28:11'),(43,1,'LOGOUT','AUTH','Người dùng đăng xuất khỏi hệ thống (0929894248)',NULL,NULL,'2026-10-30 19:28:27'),(44,1,'FORGOT_PASSWORD','AUTH','Yêu cầu gửi OTP khôi phục mật khẩu đến SĐT: 0929894248',NULL,NULL,'2026-10-30 19:28:27'),(45,1,'RESET_PASSWORD','AUTH','Đặt lại mật khẩu thành công qua xác thực OTP cho SĐT: 0929894248',NULL,NULL,'2026-10-30 19:28:27'),(46,1,'UPDATE_PROFILE','CUSTOMER','Cập nhật thông tin hồ sơ cá nhân',NULL,NULL,'2026-10-30 19:28:27'),(47,1,'CHANGE_PASSWORD','CUSTOMER','Thay đổi mật khẩu thành công',NULL,NULL,'2026-10-30 19:28:27'),(48,1,'CREATE','CATEGORY','Tạo danh mục mới: Trái Cây Mùa Thu Đặc Sản',NULL,NULL,'2026-10-30 19:28:28'),(49,1,'CREATE','ORDER','Tạo đơn hàng mới mã OD202610309287 tổng tiền 205.000 đ',NULL,NULL,'2026-10-30 19:28:28'),(50,1,'UPDATE_STATUS','ORDER','Cập nhật đơn hàng OD202610309287 sang trạng thái: DANG_CHUAN_BI',NULL,NULL,'2026-10-30 19:28:28'),(51,1,'CANCEL_ORDER','ORDER','Hủy đơn hàng OD202610309287. Lý do: Khách đổi ý muốn đặt món khác',NULL,NULL,'2026-10-30 19:28:28'),(52,1,'PAYMENT_WEBHOOK','PAYMENT','Nhận webhook thanh toán đơn OD202610309287: Thành công',NULL,NULL,'2026-10-30 19:28:28'),(53,1,'CREATE_SHIPMENT','SHIPMENT','Đã kết nối tạo vận đơn GreenSM mã GSM-740929 cho đơn OD202610309287',NULL,NULL,'2026-10-30 19:28:28'),(54,1,'CREATE_ADMIN','ADMIN','Tạo mới tài khoản quản trị: Quản Lý Chi Nhánh Q1 (0977889911) - Chi nhánh 2',NULL,NULL,'2026-10-30 19:28:29'),(55,1,'UPDATE_ADMIN','ADMIN','Cập nhật tài khoản quản trị ID 7 (Mở khóa)',NULL,NULL,'2026-10-30 19:28:29'),(56,1,'DELETE_ADMIN','ADMIN','Xóa tài khoản quản trị ID 7',NULL,NULL,'2026-10-30 19:28:29'),(57,1,'UPDATE_PERMISSIONS','PERMISSION','Cập nhật phân quyền cho Role ID 2 (6 quyền)',NULL,NULL,'2026-10-30 19:28:29'),(58,1,'UPDATE_SETTINGS','SYSTEM','Cập nhật thông số cấu hình hệ thống website',NULL,NULL,'2026-10-30 19:28:29'),(59,1,'LOGOUT','AUTH','Người dùng đăng xuất khỏi hệ thống (0929894248)',NULL,NULL,'2026-10-30 19:28:43'),(60,1,'FORGOT_PASSWORD','AUTH','Yêu cầu gửi OTP khôi phục mật khẩu đến SĐT: 0929894248',NULL,NULL,'2026-10-30 19:28:43'),(61,1,'RESET_PASSWORD','AUTH','Đặt lại mật khẩu thành công qua xác thực OTP cho SĐT: 0929894248',NULL,NULL,'2026-10-30 19:28:43'),(62,1,'UPDATE_PROFILE','CUSTOMER','Cập nhật thông tin hồ sơ cá nhân',NULL,NULL,'2026-10-30 19:28:43'),(63,1,'CHANGE_PASSWORD','CUSTOMER','Thay đổi mật khẩu thành công',NULL,NULL,'2026-10-30 19:28:43'),(64,1,'CREATE','CATEGORY','Tạo danh mục mới: Trái Cây Mùa Thu Đặc Sản',NULL,NULL,'2026-10-30 19:28:43'),(65,1,'CREATE','ORDER','Tạo đơn hàng mới mã OD202610307160 tổng tiền 205.000 đ',NULL,NULL,'2026-10-30 19:28:43'),(66,1,'UPDATE_STATUS','ORDER','Cập nhật đơn hàng OD202610307160 sang trạng thái: DANG_CHUAN_BI',NULL,NULL,'2026-10-30 19:28:44'),(67,1,'CANCEL_ORDER','ORDER','Hủy đơn hàng OD202610307160. Lý do: Khách đổi ý muốn đặt món khác',NULL,NULL,'2026-10-30 19:28:44'),(68,1,'PAYMENT_WEBHOOK','PAYMENT','Nhận webhook thanh toán đơn OD202610307160: Thành công',NULL,NULL,'2026-10-30 19:28:44'),(69,1,'CREATE_SHIPMENT','SHIPMENT','Đã kết nối tạo vận đơn GreenSM mã GSM-378703 cho đơn OD202610307160',NULL,NULL,'2026-10-30 19:28:44'),(70,1,'CREATE_ADMIN','ADMIN','Tạo mới tài khoản quản trị: Quản Lý Chi Nhánh Q1 (0977889911) - Chi nhánh 2',NULL,NULL,'2026-10-30 19:28:44'),(71,1,'UPDATE_ADMIN','ADMIN','Cập nhật tài khoản quản trị ID 8 (Mở khóa)',NULL,NULL,'2026-10-30 19:28:44'),(72,1,'DELETE_ADMIN','ADMIN','Xóa tài khoản quản trị ID 8',NULL,NULL,'2026-10-30 19:28:44'),(73,1,'UPDATE_PERMISSIONS','PERMISSION','Cập nhật phân quyền cho Role ID 2 (6 quyền)',NULL,NULL,'2026-10-30 19:28:44'),(74,1,'UPDATE_SETTINGS','SYSTEM','Cập nhật thông số cấu hình hệ thống website',NULL,NULL,'2026-10-30 19:28:44'),(75,1,'LOGOUT','AUTH','Người dùng đăng xuất khỏi hệ thống (0929894248)',NULL,NULL,'2026-10-30 19:30:40'),(76,1,'FORGOT_PASSWORD','AUTH','Yêu cầu gửi OTP khôi phục mật khẩu đến SĐT: 0929894248',NULL,NULL,'2026-10-30 19:30:40'),(77,1,'RESET_PASSWORD','AUTH','Đặt lại mật khẩu thành công qua xác thực OTP cho SĐT: 0929894248',NULL,NULL,'2026-10-30 19:30:40'),(78,1,'UPDATE_PROFILE','CUSTOMER','Cập nhật thông tin hồ sơ cá nhân',NULL,NULL,'2026-10-30 19:30:40'),(79,1,'CHANGE_PASSWORD','CUSTOMER','Thay đổi mật khẩu thành công',NULL,NULL,'2026-10-30 19:30:40'),(80,1,'CREATE','CATEGORY','Tạo danh mục mới: Trái Cây Mùa Thu Đặc Sản',NULL,NULL,'2026-10-30 19:30:41'),(81,1,'CREATE','ORDER','Tạo đơn hàng mới mã OD202610301844 tổng tiền 205.000 đ',NULL,NULL,'2026-10-30 19:30:41'),(82,1,'UPDATE_STATUS','ORDER','Cập nhật đơn hàng OD202610301844 sang trạng thái: DANG_CHUAN_BI',NULL,NULL,'2026-10-30 19:30:41'),(83,1,'CANCEL_ORDER','ORDER','Hủy đơn hàng OD202610301844. Lý do: Khách đổi ý muốn đặt món khác',NULL,NULL,'2026-10-30 19:30:41'),(84,1,'PAYMENT_WEBHOOK','PAYMENT','Nhận webhook thanh toán đơn OD202610301844: Thành công',NULL,NULL,'2026-10-30 19:30:41'),(85,1,'CREATE_SHIPMENT','SHIPMENT','Đã kết nối tạo vận đơn GreenSM mã GSM-504716 cho đơn OD202610301844',NULL,NULL,'2026-10-30 19:30:41'),(86,1,'CREATE_ADMIN','ADMIN','Tạo mới tài khoản quản trị: Quản Lý Chi Nhánh Q1 (0977889911) - Chi nhánh 2',NULL,NULL,'2026-10-30 19:30:42'),(87,1,'UPDATE_ADMIN','ADMIN','Cập nhật tài khoản quản trị ID 9 (Mở khóa)',NULL,NULL,'2026-10-30 19:30:42'),(88,1,'DELETE_ADMIN','ADMIN','Xóa tài khoản quản trị ID 9',NULL,NULL,'2026-10-30 19:30:42'),(89,1,'UPDATE_PERMISSIONS','PERMISSION','Cập nhật phân quyền cho Role ID 2 (6 quyền)',NULL,NULL,'2026-10-30 19:30:42'),(90,1,'UPDATE_SETTINGS','SYSTEM','Cập nhật thông số cấu hình hệ thống website',NULL,NULL,'2026-10-30 19:30:42'),(91,1,'LOGOUT','AUTH','Người dùng đăng xuất khỏi hệ thống (0929894248)',NULL,NULL,'2026-10-30 19:35:16'),(92,1,'FORGOT_PASSWORD','AUTH','Yêu cầu gửi OTP khôi phục mật khẩu đến SĐT: 0929894248',NULL,NULL,'2026-10-30 19:35:17'),(93,1,'RESET_PASSWORD','AUTH','Đặt lại mật khẩu thành công qua xác thực OTP cho SĐT: 0929894248',NULL,NULL,'2026-10-30 19:35:17'),(94,1,'UPDATE_PROFILE','CUSTOMER','Cập nhật thông tin hồ sơ cá nhân',NULL,NULL,'2026-10-30 19:35:17'),(95,1,'CHANGE_PASSWORD','CUSTOMER','Thay đổi mật khẩu thành công',NULL,NULL,'2026-10-30 19:35:17'),(96,1,'CREATE','CATEGORY','Tạo danh mục mới: Trái Cây Mùa Thu Đặc Sản',NULL,NULL,'2026-10-30 19:35:18'),(97,1,'CREATE','ORDER','Tạo đơn hàng mới mã OD202610309798 tổng tiền 205.000 đ',NULL,NULL,'2026-10-30 19:35:18'),(98,1,'UPDATE_STATUS','ORDER','Cập nhật đơn hàng OD202610309798 sang trạng thái: DANG_CHUAN_BI',NULL,NULL,'2026-10-30 19:35:18'),(99,1,'CANCEL_ORDER','ORDER','Hủy đơn hàng OD202610309798. Lý do: Khách đổi ý muốn đặt món khác',NULL,NULL,'2026-10-30 19:35:18'),(100,1,'PAYMENT_WEBHOOK','PAYMENT','Nhận webhook thanh toán đơn OD202610309798: Thành công',NULL,NULL,'2026-10-30 19:35:19'),(101,1,'CREATE_SHIPMENT','SHIPMENT','Đã kết nối tạo vận đơn GreenSM mã GSM-100743 cho đơn OD202610309798',NULL,NULL,'2026-10-30 19:35:19'),(102,1,'CREATE_ADMIN','ADMIN','Tạo mới tài khoản quản trị: Quản Lý Chi Nhánh Q1 (0977889911) - Chi nhánh 2',NULL,NULL,'2026-10-30 19:35:19'),(103,1,'UPDATE_ADMIN','ADMIN','Cập nhật tài khoản quản trị ID 10 (Mở khóa)',NULL,NULL,'2026-10-30 19:35:19'),(104,1,'DELETE_ADMIN','ADMIN','Xóa tài khoản quản trị ID 10',NULL,NULL,'2026-10-30 19:35:19'),(105,1,'UPDATE_PERMISSIONS','PERMISSION','Cập nhật phân quyền cho Role ID 2 (6 quyền)',NULL,NULL,'2026-10-30 19:35:19'),(106,1,'UPDATE_SETTINGS','SYSTEM','Cập nhật thông số cấu hình hệ thống website',NULL,NULL,'2026-10-30 19:35:19'),(107,1,'LOGOUT','AUTH','Người dùng đăng xuất khỏi hệ thống (0929894248)',NULL,NULL,'2026-10-30 19:38:35'),(108,1,'FORGOT_PASSWORD','AUTH','Yêu cầu gửi OTP khôi phục mật khẩu đến SĐT: 0929894248',NULL,NULL,'2026-10-30 19:38:36'),(109,1,'RESET_PASSWORD','AUTH','Đặt lại mật khẩu thành công qua xác thực OTP cho SĐT: 0929894248',NULL,NULL,'2026-10-30 19:38:36'),(110,1,'UPDATE_PROFILE','CUSTOMER','Cập nhật thông tin hồ sơ cá nhân',NULL,NULL,'2026-10-30 19:38:36'),(111,1,'CHANGE_PASSWORD','CUSTOMER','Thay đổi mật khẩu thành công',NULL,NULL,'2026-10-30 19:38:36'),(112,1,'CREATE','CATEGORY','Tạo danh mục mới: Trái Cây Mùa Thu Đặc Sản',NULL,NULL,'2026-10-30 19:38:39'),(113,1,'CREATE','ORDER','Tạo đơn hàng mới mã OD202610304952 tổng tiền 205.000 đ',NULL,NULL,'2026-10-30 19:38:41'),(114,1,'UPDATE_STATUS','ORDER','Cập nhật đơn hàng OD202610304952 sang trạng thái: DANG_CHUAN_BI',NULL,NULL,'2026-10-30 19:38:41'),(115,1,'CANCEL_ORDER','ORDER','Hủy đơn hàng OD202610304952. Lý do: Khách đổi ý muốn đặt món khác',NULL,NULL,'2026-10-30 19:38:43'),(116,1,'PAYMENT_WEBHOOK','PAYMENT','Nhận webhook thanh toán đơn OD202610304952: Thành công',NULL,NULL,'2026-10-30 19:38:44'),(117,1,'CREATE_SHIPMENT','SHIPMENT','Đã kết nối tạo vận đơn GreenSM mã GSM-878928 cho đơn OD202610304952',NULL,NULL,'2026-10-30 19:38:44'),(118,1,'CREATE_ADMIN','ADMIN','Tạo mới tài khoản quản trị: Quản Lý Chi Nhánh Q1 (0977889911) - Chi nhánh 2',NULL,NULL,'2026-10-30 19:38:44'),(119,1,'UPDATE_ADMIN','ADMIN','Cập nhật tài khoản quản trị ID 11 (Mở khóa)',NULL,NULL,'2026-10-30 19:38:45'),(120,1,'DELETE_ADMIN','ADMIN','Xóa tài khoản quản trị ID 11',NULL,NULL,'2026-10-30 19:38:45'),(121,1,'UPDATE_PERMISSIONS','PERMISSION','Cập nhật phân quyền cho Role ID 2 (6 quyền)',NULL,NULL,'2026-10-30 19:38:47'),(122,1,'UPDATE_SETTINGS','SYSTEM','Cập nhật thông số cấu hình hệ thống website',NULL,NULL,'2026-10-30 19:38:47'),(123,1,'LOGOUT','AUTH','Người dùng đăng xuất khỏi hệ thống (0929894248)',NULL,NULL,'2026-10-30 19:41:45'),(124,1,'FORGOT_PASSWORD','AUTH','Yêu cầu gửi OTP khôi phục mật khẩu đến SĐT: 0929894248',NULL,NULL,'2026-10-30 19:41:45'),(125,1,'RESET_PASSWORD','AUTH','Đặt lại mật khẩu thành công qua xác thực OTP cho SĐT: 0929894248',NULL,NULL,'2026-10-30 19:41:45'),(126,1,'UPDATE_PROFILE','CUSTOMER','Cập nhật thông tin hồ sơ cá nhân',NULL,NULL,'2026-10-30 19:41:45'),(127,1,'CHANGE_PASSWORD','CUSTOMER','Thay đổi mật khẩu thành công',NULL,NULL,'2026-10-30 19:41:45'),(128,1,'CREATE','CATEGORY','Tạo danh mục mới: Trái Cây Mùa Thu Đặc Sản',NULL,NULL,'2026-10-30 19:41:46'),(129,1,'CREATE','ORDER','Tạo đơn hàng mới mã OD202610305819 tổng tiền 205.000 đ',NULL,NULL,'2026-10-30 19:41:46'),(130,1,'UPDATE_STATUS','ORDER','Cập nhật đơn hàng OD202610305819 sang trạng thái: DANG_CHUAN_BI',NULL,NULL,'2026-10-30 19:41:46'),(131,1,'CANCEL_ORDER','ORDER','Hủy đơn hàng OD202610305819. Lý do: Khách đổi ý muốn đặt món khác',NULL,NULL,'2026-10-30 19:41:46'),(132,1,'PAYMENT_WEBHOOK','PAYMENT','Nhận webhook thanh toán đơn OD202610305819: Thành công',NULL,NULL,'2026-10-30 19:41:46'),(133,1,'CREATE_SHIPMENT','SHIPMENT','Đã kết nối tạo vận đơn GreenSM mã GSM-532707 cho đơn OD202610305819',NULL,NULL,'2026-10-30 19:41:46'),(134,1,'CREATE_ADMIN','ADMIN','Tạo mới tài khoản quản trị: Quản Lý Chi Nhánh Q1 (0977889911) - Chi nhánh 2',NULL,NULL,'2026-10-30 19:41:47'),(135,1,'UPDATE_ADMIN','ADMIN','Cập nhật tài khoản quản trị ID 12 (Mở khóa)',NULL,NULL,'2026-10-30 19:41:47'),(136,1,'DELETE_ADMIN','ADMIN','Xóa tài khoản quản trị ID 12',NULL,NULL,'2026-10-30 19:41:47'),(137,1,'UPDATE_PERMISSIONS','PERMISSION','Cập nhật phân quyền cho Role ID 2 (6 quyền)',NULL,NULL,'2026-10-30 19:41:47'),(138,1,'UPDATE_SETTINGS','SYSTEM','Cập nhật thông số cấu hình hệ thống website',NULL,NULL,'2026-10-30 19:41:47'),(139,1,'FORGOT_PASSWORD','AUTH','Yêu cầu gửi OTP khôi phục mật khẩu đến SĐT: 0929894248',NULL,NULL,'2026-10-30 19:46:45'),(140,1,'RESET_PASSWORD','AUTH','Đặt lại mật khẩu thành công qua xác thực OTP cho SĐT: 0929894248',NULL,NULL,'2026-10-30 19:46:45'),(141,1,'CREATE','CATEGORY','Tạo danh mục mới: Trái Cây Nhập Khẩu 0135',NULL,NULL,'2026-10-30 19:46:50'),(142,1,'CREATE','ORDER','Tạo đơn hàng mới mã OD202610305326 tổng tiền 205.000 đ',NULL,NULL,'2026-10-30 19:46:53'),(143,1,'ORDER_NOTE','ORDER','Ghi chú đơn hàng mã/id #OD202610305326: Khách yêu cầu giao trước 17h',NULL,NULL,'2026-10-30 19:46:55'),(144,1,'CANCEL_ORDER','ORDER','Hủy đơn hàng OD202610305326. Lý do: Khách đổi ý muốn đặt món khác',NULL,NULL,'2026-10-30 19:46:55'),(145,1,'PAYMENT_WEBHOOK','PAYMENT','Nhận webhook thanh toán đơn OD202610305326: Thành công',NULL,NULL,'2026-10-30 19:46:56'),(146,1,'CREATE_SHIPMENT','SHIPMENT','Đã kết nối tạo vận đơn GreenSM mã GSM-431529 cho đơn OD202610305326',NULL,NULL,'2026-10-30 19:46:56'),(147,1,'CREATE_ADMIN','ADMIN','Tạo mới tài khoản quản trị: Quản Lý Chi Nhánh Word (0989643290) - Chi nhánh 1',NULL,NULL,'2026-10-30 19:46:56'),(148,1,'UPDATE_PERMISSIONS','PERMISSION','Cập nhật phân quyền cho Role ID 2 (0 quyền)',NULL,NULL,'2026-10-30 19:47:00'),(149,1,'UPDATE_SETTINGS','SYSTEM','Cập nhật thông số cấu hình hệ thống website',NULL,NULL,'2026-10-30 19:47:01'),(150,1,'FORGOT_PASSWORD','AUTH','Yêu cầu gửi OTP khôi phục mật khẩu đến SĐT: 0929894248',NULL,NULL,'2026-10-30 19:48:52'),(151,1,'RESET_PASSWORD','AUTH','Đặt lại mật khẩu thành công qua xác thực OTP cho SĐT: 0929894248',NULL,NULL,'2026-10-30 19:48:52'),(152,1,'UPDATE_PROFILE','CUSTOMER','Cập nhật thông tin hồ sơ cá nhân',NULL,NULL,'2026-10-30 19:48:52'),(153,1,'CREATE','CATEGORY','Tạo danh mục mới: Trái Cây Nhập Khẩu 2743',NULL,NULL,'2026-10-30 19:48:52'),(154,1,'CREATE','ORDER','Tạo đơn hàng mới mã OD202610303086 tổng tiền 205.000 đ',NULL,NULL,'2026-10-30 19:48:53'),(155,1,'ORDER_NOTE','ORDER','Ghi chú đơn hàng mã/id #OD202610303086: Khách yêu cầu giao trước 17h',NULL,NULL,'2026-10-30 19:48:53'),(156,1,'CANCEL_ORDER','ORDER','Hủy đơn hàng OD202610303086. Lý do: Khách đổi ý muốn đặt món khác',NULL,NULL,'2026-10-30 19:48:53'),(157,1,'PAYMENT_WEBHOOK','PAYMENT','Nhận webhook thanh toán đơn OD202610303086: Thành công',NULL,NULL,'2026-10-30 19:48:53'),(158,1,'CREATE_SHIPMENT','SHIPMENT','Đã kết nối tạo vận đơn GreenSM mã GSM-161294 cho đơn OD202610303086',NULL,NULL,'2026-10-30 19:48:53'),(159,1,'CREATE_ADMIN','ADMIN','Tạo mới tài khoản quản trị: Quản Lý Chi Nhánh Word (0920407124) - Chi nhánh 1',NULL,NULL,'2026-10-30 19:48:54'),(160,1,'UPDATE_PERMISSIONS','PERMISSION','Cập nhật phân quyền cho Role ID 2 (0 quyền)',NULL,NULL,'2026-10-30 19:48:56'),(161,1,'UPDATE_SETTINGS','SYSTEM','Cập nhật thông số cấu hình hệ thống website',NULL,NULL,'2026-10-30 19:48:56'),(162,1,'FORGOT_PASSWORD','AUTH','Yêu cầu gửi OTP khôi phục mật khẩu đến SĐT: 0929894248',NULL,NULL,'2026-10-30 19:49:29'),(163,1,'RESET_PASSWORD','AUTH','Đặt lại mật khẩu thành công qua xác thực OTP cho SĐT: 0929894248',NULL,NULL,'2026-10-30 19:49:29'),(164,1,'UPDATE_PROFILE','CUSTOMER','Cập nhật thông tin hồ sơ cá nhân',NULL,NULL,'2026-10-30 19:49:29'),(165,1,'CHANGE_PASSWORD','CUSTOMER','Thay đổi mật khẩu thành công',NULL,NULL,'2026-10-30 19:49:29'),(166,1,'CREATE','CATEGORY','Tạo danh mục mới: Trái Cây Nhập Khẩu 0213',NULL,NULL,'2026-10-30 19:49:30'),(167,1,'CREATE','ORDER','Tạo đơn hàng mới mã OD202610302540 tổng tiền 205.000 đ',NULL,NULL,'2026-10-30 19:49:30'),(168,1,'ORDER_NOTE','ORDER','Ghi chú đơn hàng mã/id #OD202610302540: Khách yêu cầu giao trước 17h',NULL,NULL,'2026-10-30 19:49:30'),(169,1,'CANCEL_ORDER','ORDER','Hủy đơn hàng OD202610302540. Lý do: Khách đổi ý muốn đặt món khác',NULL,NULL,'2026-10-30 19:49:30'),(170,1,'PAYMENT_WEBHOOK','PAYMENT','Nhận webhook thanh toán đơn OD202610302540: Thành công',NULL,NULL,'2026-10-30 19:49:31'),(171,1,'CREATE_SHIPMENT','SHIPMENT','Đã kết nối tạo vận đơn GreenSM mã GSM-368742 cho đơn OD202610302540',NULL,NULL,'2026-10-30 19:49:31'),(172,1,'CREATE_ADMIN','ADMIN','Tạo mới tài khoản quản trị: Quản Lý Chi Nhánh Word (0982622186) - Chi nhánh 1',NULL,NULL,'2026-10-30 19:49:31'),(173,1,'UPDATE_ADMIN','ADMIN','Cập nhật tài khoản quản trị ID 15 (Cập nhật TT)',NULL,NULL,'2026-10-30 19:49:32'),(174,1,'DELETE_ADMIN','ADMIN','Xóa tài khoản quản trị ID 15',NULL,NULL,'2026-10-30 19:49:32'),(175,1,'UPDATE_PERMISSIONS','PERMISSION','Cập nhật phân quyền cho Role ID 2 (0 quyền)',NULL,NULL,'2026-10-30 19:49:32'),(176,1,'UPDATE_SETTINGS','SYSTEM','Cập nhật thông số cấu hình hệ thống website',NULL,NULL,'2026-10-30 19:49:32'),(177,1,'FORGOT_PASSWORD','AUTH','Yêu cầu gửi OTP khôi phục mật khẩu đến SĐT: 0929894248',NULL,NULL,'2026-10-30 19:49:57'),(178,1,'RESET_PASSWORD','AUTH','Đặt lại mật khẩu thành công qua xác thực OTP cho SĐT: 0929894248',NULL,NULL,'2026-10-30 19:49:57'),(179,1,'UPDATE_PROFILE','CUSTOMER','Cập nhật thông tin hồ sơ cá nhân',NULL,NULL,'2026-10-30 19:49:57'),(180,1,'CHANGE_PASSWORD','CUSTOMER','Thay đổi mật khẩu thành công',NULL,NULL,'2026-10-30 19:49:57'),(181,1,'CREATE','CATEGORY','Tạo danh mục mới: Trái Cây Nhập Khẩu 8224',NULL,NULL,'2026-10-30 19:49:58'),(182,1,'CREATE','ORDER','Tạo đơn hàng mới mã OD202610302117 tổng tiền 205.000 đ',NULL,NULL,'2026-10-30 19:49:58'),(183,1,'ORDER_NOTE','ORDER','Ghi chú đơn hàng mã/id #OD202610302117: Khách yêu cầu giao trước 17h',NULL,NULL,'2026-10-30 19:49:58'),(184,1,'CANCEL_ORDER','ORDER','Hủy đơn hàng OD202610302117. Lý do: Khách đổi ý muốn đặt món khác',NULL,NULL,'2026-10-30 19:49:58'),(185,1,'PAYMENT_WEBHOOK','PAYMENT','Nhận webhook thanh toán đơn OD202610302117: Thành công',NULL,NULL,'2026-10-30 19:49:58'),(186,1,'CREATE_SHIPMENT','SHIPMENT','Đã kết nối tạo vận đơn GreenSM mã GSM-989268 cho đơn OD202610302117',NULL,NULL,'2026-10-30 19:49:58'),(187,1,'CREATE_ADMIN','ADMIN','Tạo mới tài khoản quản trị: Quản Lý Chi Nhánh Word (0984838829) - Chi nhánh 1',NULL,NULL,'2026-10-30 19:49:59'),(188,1,'UPDATE_ADMIN','ADMIN','Cập nhật tài khoản quản trị ID 16 (Cập nhật TT)',NULL,NULL,'2026-10-30 19:49:59'),(189,1,'DELETE_ADMIN','ADMIN','Xóa tài khoản quản trị ID 16',NULL,NULL,'2026-10-30 19:49:59'),(190,1,'UPDATE_PERMISSIONS','PERMISSION','Cập nhật phân quyền cho Role ID 2 (0 quyền)',NULL,NULL,'2026-10-30 19:49:59'),(191,1,'UPDATE_SETTINGS','SYSTEM','Cập nhật thông số cấu hình hệ thống website',NULL,NULL,'2026-10-30 19:49:59'),(192,1,'FORGOT_PASSWORD','AUTH','Yêu cầu gửi OTP khôi phục mật khẩu đến SĐT: 0929894248',NULL,NULL,'2026-10-30 19:55:24'),(193,1,'RESET_PASSWORD','AUTH','Đặt lại mật khẩu thành công qua xác thực OTP cho SĐT: 0929894248',NULL,NULL,'2026-10-30 19:55:24'),(194,1,'UPDATE_PROFILE','CUSTOMER','Cập nhật thông tin hồ sơ cá nhân',NULL,NULL,'2026-10-30 19:55:24'),(195,1,'CHANGE_PASSWORD','CUSTOMER','Thay đổi mật khẩu thành công',NULL,NULL,'2026-10-30 19:55:24'),(196,1,'CREATE','CATEGORY','Tạo danh mục mới: Trái Cây Nhập Khẩu 4899',NULL,NULL,'2026-10-30 19:55:24'),(197,1,'CREATE','ORDER','Tạo đơn hàng mới mã OD202610301630 tổng tiền 205.000 đ',NULL,NULL,'2026-10-30 19:55:25'),(198,1,'ORDER_NOTE','ORDER','Ghi chú đơn hàng mã/id #OD202610301630: Khách yêu cầu giao trước 17h',NULL,NULL,'2026-10-30 19:55:25'),(199,1,'CANCEL_ORDER','ORDER','Hủy đơn hàng OD202610301630. Lý do: Khách đổi ý muốn đặt món khác',NULL,NULL,'2026-10-30 19:55:25'),(200,1,'PAYMENT_WEBHOOK','PAYMENT','Nhận webhook thanh toán đơn OD202610301630: Thành công',NULL,NULL,'2026-10-30 19:55:25'),(201,1,'CREATE_SHIPMENT','SHIPMENT','Đã kết nối tạo vận đơn GreenSM mã GSM-591781 cho đơn OD202610301630',NULL,NULL,'2026-10-30 19:55:25'),(202,1,'CREATE_ADMIN','ADMIN','Tạo mới tài khoản quản trị: Quản Lý Chi Nhánh Word (0947460750) - Chi nhánh 1',NULL,NULL,'2026-10-30 19:55:26'),(203,1,'UPDATE_ADMIN','ADMIN','Cập nhật tài khoản quản trị ID 17 (Cập nhật TT)',NULL,NULL,'2026-10-30 19:55:26'),(204,1,'DELETE_ADMIN','ADMIN','Xóa tài khoản quản trị ID 17',NULL,NULL,'2026-10-30 19:55:26'),(205,1,'UPDATE_PERMISSIONS','PERMISSION','Cập nhật phân quyền cho Role ID 2 (0 quyền)',NULL,NULL,'2026-10-30 19:55:26'),(206,1,'UPDATE_SETTINGS','SYSTEM','Cập nhật thông số cấu hình hệ thống website',NULL,NULL,'2026-10-30 19:55:26'),(207,1,'LOGOUT','AUTH','Người dùng đăng xuất khỏi hệ thống (0929894248)',NULL,NULL,'2026-10-30 19:55:31'),(208,1,'FORGOT_PASSWORD','AUTH','Yêu cầu gửi OTP khôi phục mật khẩu đến SĐT: 0929894248',NULL,NULL,'2026-10-30 19:55:31'),(209,1,'RESET_PASSWORD','AUTH','Đặt lại mật khẩu thành công qua xác thực OTP cho SĐT: 0929894248',NULL,NULL,'2026-10-30 19:55:31'),(210,1,'UPDATE_PROFILE','CUSTOMER','Cập nhật thông tin hồ sơ cá nhân',NULL,NULL,'2026-10-30 19:55:31'),(211,1,'CHANGE_PASSWORD','CUSTOMER','Thay đổi mật khẩu thành công',NULL,NULL,'2026-10-30 19:55:31'),(212,1,'CREATE','CATEGORY','Tạo danh mục mới: Trái Cây Mùa Thu Đặc Sản',NULL,NULL,'2026-10-30 19:55:31'),(213,1,'CREATE','ORDER','Tạo đơn hàng mới mã OD202610308406 tổng tiền 205.000 đ',NULL,NULL,'2026-10-30 19:55:32'),(214,1,'UPDATE_STATUS','ORDER','Cập nhật đơn hàng OD202610308406 sang trạng thái: DANG_CHUAN_BI',NULL,NULL,'2026-10-30 19:55:32'),(215,1,'CANCEL_ORDER','ORDER','Hủy đơn hàng OD202610308406. Lý do: Khách đổi ý muốn đặt món khác',NULL,NULL,'2026-10-30 19:55:32'),(216,1,'PAYMENT_WEBHOOK','PAYMENT','Nhận webhook thanh toán đơn OD202610308406: Thành công',NULL,NULL,'2026-10-30 19:55:32'),(217,1,'CREATE_SHIPMENT','SHIPMENT','Đã kết nối tạo vận đơn GreenSM mã GSM-811779 cho đơn OD202610308406',NULL,NULL,'2026-10-30 19:55:32'),(218,1,'CREATE_ADMIN','ADMIN','Tạo mới tài khoản quản trị: Quản Lý Chi Nhánh Q1 (0977889911) - Chi nhánh 2',NULL,NULL,'2026-10-30 19:55:32'),(219,1,'UPDATE_ADMIN','ADMIN','Cập nhật tài khoản quản trị ID 18 (Mở khóa)',NULL,NULL,'2026-10-30 19:55:32'),(220,1,'DELETE_ADMIN','ADMIN','Xóa tài khoản quản trị ID 18',NULL,NULL,'2026-10-30 19:55:32'),(221,1,'UPDATE_PERMISSIONS','PERMISSION','Cập nhật phân quyền cho Role ID 2 (6 quyền)',NULL,NULL,'2026-10-30 19:55:33'),(222,1,'UPDATE_SETTINGS','SYSTEM','Cập nhật thông số cấu hình hệ thống website',NULL,NULL,'2026-10-30 19:55:33'),(223,2,'LOGIN','','Đăng nhập thành công vai trò: Admin Chi nhánh','::1','node','2026-10-30 20:43:50'),(224,1,'LOGIN','','Đăng nhập thành công vai trò: Admin Tổng','::1','node','2026-10-30 20:43:50'),(225,19,'LOGIN','','Đăng nhập thành công vai trò: Khách hàng','::1','node','2026-10-30 20:44:32'),(226,1,'LOGIN','','Đăng nhập thành công vai trò: Admin Tổng','::1','node','2026-10-30 20:44:32'),(227,2,'LOGIN','','Đăng nhập thành công vai trò: Admin Chi nhánh','::1','node','2026-10-30 20:44:32'),(228,1,'LOGOUT','AUTH','Người dùng đăng xuất khỏi hệ thống (0929894248)',NULL,NULL,'2026-10-30 20:52:04'),(229,1,'LOGOUT','AUTH','Người dùng đăng xuất khỏi hệ thống (0929894248)',NULL,NULL,'2026-10-30 21:22:45'),(230,1,'LOGIN','','Đăng nhập thành công vai trò: Admin Tổng','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-10-30 21:22:50'),(231,1,'LOGOUT','AUTH','Người dùng đăng xuất khỏi hệ thống (0929894248)',NULL,NULL,'2026-10-30 21:27:45'),(232,19,'LOGIN','','Đăng nhập thành công vai trò: Khách hàng','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-10-30 21:27:54'),(233,2,'LOGIN','','Đăng nhập thành công vai trò: Admin Chi nhánh','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-10-30 21:27:57'),(234,19,'FORGOT_PASSWORD','AUTH','Yêu cầu gửi OTP khôi phục mật khẩu đến SĐT: 0901234567',NULL,NULL,'2026-10-30 21:35:54'),(235,19,'RESET_PASSWORD','AUTH','Đặt lại mật khẩu thành công qua xác thực OTP cho SĐT: 0901234567',NULL,NULL,'2026-10-30 21:35:54'),(236,19,'RESET_PASSWORD','AUTH','Đặt lại mật khẩu thành công qua xác thực OTP cho SĐT: 0901234567',NULL,NULL,'2026-10-30 21:35:54'),(237,19,'FORGOT_PASSWORD','AUTH','Yêu cầu gửi OTP khôi phục mật khẩu đến SĐT: 0901234567',NULL,NULL,'2026-10-30 21:41:46'),(238,1,'FORGOT_PASSWORD','AUTH','Yêu cầu gửi OTP khôi phục mật khẩu đến SĐT: 0929894248',NULL,NULL,'2026-10-30 21:50:36'),(239,1,'RESET_PASSWORD','AUTH','Đặt lại mật khẩu thành công qua xác thực OTP cho SĐT: 0929894248',NULL,NULL,'2026-10-30 21:50:46'),(240,1,'LOGIN','','Đăng nhập thành công vai trò: Admin Tổng','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-10-30 21:50:48'),(241,1,'LOGOUT','AUTH','Người dùng đăng xuất khỏi hệ thống (0929894248)',NULL,NULL,'2026-10-30 21:50:50'),(242,19,'UPDATE_PROFILE','CUSTOMER','Cập nhật thông tin hồ sơ cá nhân',NULL,NULL,'2026-10-30 21:52:40'),(243,1,'CREATE_ADMIN','ADMIN','Tạo mới tài khoản quản trị: Admin Chi Nhánh Test FR6 (0988778853) - Chi nhánh 1',NULL,NULL,'2026-10-30 21:52:55'),(244,NULL,'LOGIN','','Đăng nhập thành công vai trò: Admin Chi nhánh','::1','node','2026-10-30 21:52:55'),(245,1,'UPDATE_ADMIN','ADMIN','Cập nhật tài khoản quản trị ID 20 (Cập nhật TT)',NULL,NULL,'2026-10-30 21:52:55'),(246,1,'DELETE_ADMIN','ADMIN','Xóa tài khoản quản trị ID 20',NULL,NULL,'2026-10-30 21:52:55'),(247,1,'LOGOUT','AUTH','Người dùng đăng xuất khỏi hệ thống (0929894248)',NULL,NULL,'2026-10-30 22:11:18'),(248,19,'LOGIN','','Đăng nhập thành công vai trò: Khách hàng','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-10-30 22:12:59'),(249,19,'UPDATE_PROFILE','CUSTOMER','Cập nhật thông tin hồ sơ cá nhân',NULL,NULL,'2026-10-30 22:26:58'),(250,19,'LOGOUT','AUTH','Người dùng đăng xuất khỏi hệ thống (0901234567)',NULL,NULL,'2026-10-30 22:29:22'),(251,1,'LOGIN','','Đăng nhập thành công vai trò: Admin Tổng','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-10-30 22:29:24'),(252,1,'CREATE_ADMIN','ADMIN','Tạo mới tài khoản quản trị: Admin Chi Nh�nh Test (0929643404) - Chi nhánh 1',NULL,NULL,'2026-10-30 22:31:28'),(253,NULL,'LOGIN','','Đăng nhập thành công vai trò: Admin Chi nhánh','::1','Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.9711','2026-10-30 22:31:40'),(254,1,'DELETE_ADMIN','ADMIN','Xóa tài khoản quản trị ID 21',NULL,NULL,'2026-10-30 22:31:46'),(255,1,'UPDATE_STATUS','ORDER','Cập nhật đơn hàng OD202610308406 sang trạng thái: DA_GIAO',NULL,NULL,'2026-10-30 22:36:39'),(256,1,'DELETE_ADMIN','ADMIN','Xóa tài khoản quản trị ID 13',NULL,NULL,'2026-10-30 22:37:02'),(257,1,'UPDATE_ADMIN','ADMIN','Chỉnh sửa thông tin quản trị viên ID 14 (Quản Lý Chi Nhánh Word (Đã sửa))',NULL,NULL,'2026-11-01 01:33:41'),(258,1,'UPDATE_ADMIN','ADMIN','Đặt lại mật khẩu cho quản trị viên ID 14 (Quản Lý Chi Nhánh Word (Đã sửa))',NULL,NULL,'2026-11-01 01:33:41'),(259,1,'UPDATE_ADMIN','ADMIN','Đặt lại mật khẩu cho quản trị viên ID 14 (Quản Lý Chi Nhánh Word (Đã sửa))',NULL,NULL,'2026-11-01 01:33:41'),(260,1,'LOGOUT','AUTH','Người dùng đăng xuất khỏi hệ thống (0929894248)',NULL,NULL,'2026-11-01 01:44:57'),(261,1,'UPDATE_ADMIN','ADMIN','Chỉnh sửa thông tin quản trị viên ID 14 (Quản Lý Chi Nhánh Word)',NULL,NULL,'2026-11-01 01:52:28'),(262,1,'ASSIGN_PERMISSIONS','ADMIN','Phân quyền chức năng cho Admin Chi nhánh: Quản Lý Chi Nhánh Word (5 quyền)',NULL,NULL,'2026-11-01 02:08:03'),(263,1,'ASSIGN_PERMISSIONS','ADMIN','Phân quyền chức năng cho Admin Chi nhánh: Quản Lý Chi Nhánh Word (15 quyền)',NULL,NULL,'2026-11-01 02:13:15'),(264,1,'ASSIGN_PERMISSIONS','ADMIN','Phân quyền chức năng cho Admin Chi nhánh: Quản Lý Chi Nhánh Word (1 quyền)',NULL,NULL,'2026-11-01 02:13:42'),(265,1,'ASSIGN_PERMISSIONS','ADMIN','Phân quyền chức năng cho Admin Chi nhánh: Quản Lý Chi Nhánh Word (15 quyền)',NULL,NULL,'2026-11-01 02:28:20'),(266,1,'CREATE_CATEGORY','CATEGORY','Tạo danh mục sản phẩm mới: Tr�i c�y tuoi (ID: 17)',NULL,NULL,'2026-11-01 02:37:40'),(267,1,'CREATE_CATEGORY','CATEGORY','Tạo danh mục sản phẩm mới: Trái cây sấy giòn (ID: 18)',NULL,NULL,'2026-11-01 02:38:07'),(268,1,'UPDATE_CATEGORY','CATEGORY','Cập nhật thông tin danh mục ID 18: Trái cây sấy thăng hoa',NULL,NULL,'2026-11-01 02:38:07'),(269,1,'TOGGLE_CATEGORY_STATUS','CATEGORY','Ẩn danh mục ID 18 (Trái cây sấy thăng hoa)',NULL,NULL,'2026-11-01 02:38:08'),(270,1,'DELETE_CATEGORY','CATEGORY','Xóa vĩnh viễn danh mục trống ID 18: Trái cây sấy thăng hoa',NULL,NULL,'2026-11-01 02:38:08'),(271,1,'TOGGLE_CATEGORY_STATUS','CATEGORY','Ẩn danh mục ID 1 (Trái cây tươi)',NULL,NULL,'2026-11-01 02:43:12'),(272,1,'TOGGLE_CATEGORY_STATUS','CATEGORY','Ẩn danh mục ID 2 (Combo trái cây)',NULL,NULL,'2026-11-01 02:43:19'),(273,1,'TOGGLE_CATEGORY_STATUS','CATEGORY','Ẩn danh mục ID 4 (Giỏ quà trái cây)',NULL,NULL,'2026-11-01 02:43:20'),(274,1,'CREATE_CATEGORY','CATEGORY','Tạo danh mục sản phẩm mới: Giàu (ID: 19)',NULL,NULL,'2026-11-01 02:44:32'),(275,1,'TOGGLE_CATEGORY_STATUS','CATEGORY','Hiển thị danh mục ID 1 (Trái cây tươi)',NULL,NULL,'2026-11-01 02:57:57'),(276,1,'TOGGLE_CATEGORY_STATUS','CATEGORY','Hiển thị danh mục ID 4 (Giỏ quà trái cây)',NULL,NULL,'2026-11-01 02:57:57'),(277,1,'TOGGLE_CATEGORY_STATUS','CATEGORY','Hiển thị danh mục ID 2 (Combo trái cây)',NULL,NULL,'2026-11-01 02:57:57'),(278,1,'DELETE_CATEGORY','CATEGORY','Xóa vĩnh viễn danh mục trống ID 19: Giàu',NULL,NULL,'2026-11-01 02:58:32'),(279,1,'PATCH_PRODUCT','PRODUCT','Điều chỉnh sản phẩm ID #22: Trạng thái -> Ẩn; ',NULL,NULL,'2026-11-01 03:11:18'),(280,1,'PATCH_PRODUCT','PRODUCT','Điều chỉnh sản phẩm ID #22: Trạng thái -> Hiển thị; ',NULL,NULL,'2026-11-01 03:11:18'),(281,1,'DELETE_PRODUCT','PRODUCT','Đã xóa vĩnh viễn sản phẩm: \"Combo Trái Cây Thanh Nhiệt 3 Món\" (ID: 20)',NULL,NULL,'2026-11-01 03:11:18'),(282,1,'CREATE_PRODUCT','PRODUCT','Thêm sản phẩm mới: Combo Trái Cây Gia Đình 3 Món (Giá: 199.000đ, Tồn kho: 45)',NULL,NULL,'2026-11-01 03:13:55'),(283,1,'PATCH_PRODUCT','PRODUCT','Điều chỉnh sản phẩm ID #23: Trạng thái -> Ẩn; ',NULL,NULL,'2026-11-01 03:24:46'),(284,1,'PATCH_PRODUCT','PRODUCT','Điều chỉnh sản phẩm ID #23: Trạng thái -> Hiển thị; ',NULL,NULL,'2026-11-01 03:24:47'),(285,1,'PATCH_PRODUCT','PRODUCT','Điều chỉnh sản phẩm ID #23: Trạng thái -> Ẩn; ',NULL,NULL,'2026-11-01 03:24:51'),(286,1,'PATCH_PRODUCT','PRODUCT','Điều chỉnh sản phẩm ID #23: Trạng thái -> Hiển thị; ',NULL,NULL,'2026-11-01 03:24:53'),(287,1,'PATCH_PRODUCT','PRODUCT','Điều chỉnh sản phẩm ID #23: Trạng thái -> Ẩn; ',NULL,NULL,'2026-11-01 03:24:55'),(288,1,'PATCH_PRODUCT','PRODUCT','Điều chỉnh sản phẩm ID #23: Trạng thái -> Hiển thị; ',NULL,NULL,'2026-11-01 03:24:57'),(289,14,'LOGOUT','AUTH','Người dùng đăng xuất khỏi hệ thống (0920407124)',NULL,NULL,'2026-11-01 03:37:49'),(290,1,'LOGIN','','Đăng nhập thành công vai trò: Admin Tổng','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/156.0.0.0 Safari/537.36','2026-11-01 03:37:50'),(291,1,'UPDATE_PRODUCT','PRODUCT','Cập nhật thông tin sản phẩm ID #23: Combo Trái Cây Gia Đình 3 Món',NULL,NULL,'2026-11-01 03:44:58'),(292,1,'UPDATE_PRODUCT','PRODUCT','Cập nhật thông tin sản phẩm ID #23: Combo Trái Cây Gia Đình 3 Món',NULL,NULL,'2026-11-01 03:45:18'),(293,1,'UPDATE_PRODUCT','PRODUCT','Cập nhật thông tin sản phẩm ID #23: Combo Trái Cây Gia Đình 3 Món',NULL,NULL,'2026-11-01 04:05:49'),(294,1,'UPDATE_PRODUCT','PRODUCT','Cập nhật thông tin sản phẩm ID #23: Combo Trái Cây Gia Đình 3 Món',NULL,NULL,'2026-11-01 04:13:35'),(295,1,'UPDATE_PRODUCT','PRODUCT','Cập nhật thông tin sản phẩm ID #23: Combo Trái Cây Gia Đình 3 Món',NULL,NULL,'2026-11-01 04:14:20'),(296,1,'UPDATE_PRODUCT','PRODUCT','Cập nhật thông tin sản phẩm ID #23: Combo Trái Cây Gia Đình 3 Món',NULL,NULL,'2026-11-01 04:14:35'),(297,22,'AUTO_REGISTER','USER','Tự động tạo tài khoản khách hàng khi đặt hàng lần đầu: 0987654321',NULL,NULL,'2026-11-01 04:14:56'),(298,22,'CREATE','ORDER','Tạo đơn hàng mới mã OD202611014933 tổng tiền 26.790 đ',NULL,NULL,'2026-11-01 04:14:56'),(299,1,'UPDATE_PRODUCT','PRODUCT','Cập nhật thông tin sản phẩm ID #23: Combo Trái Cây Gia Đình 3 Món',NULL,NULL,'2026-11-01 04:15:25'),(300,1,'UPDATE_PRODUCT','PRODUCT','Cập nhật thông tin sản phẩm ID #23: Combo Trái Cây Gia Đình 3 Món',NULL,NULL,'2026-11-01 04:15:33'),(301,1,'ASSIGN_PROMOTION_PRODUCTS','PROMOTION','Gán 1 sản phẩm vào chương trình khuyến mãi \"Lễ Hội Trái Cây Miệt Vườn\" (ID #13)',NULL,NULL,'2026-11-01 04:21:05'),(302,1,'REMOVE_PROMOTION_PRODUCT','PROMOTION','Gỡ sản phẩm #23 khỏi chương trình khuyến mãi #13',NULL,NULL,'2026-11-01 04:21:30'),(303,1,'CREATE_PROMOTION','PROMOTION','Tạo chương trình khuyến mãi mới: \"Chương trình Test Mùa Vụ Hè Thu\" (Giảm 20%)',NULL,NULL,'2026-11-01 04:36:38'),(304,1,'ASSIGN_PROMOTION_PRODUCTS','PROMOTION','Gán 1 sản phẩm vào chương trình khuyến mãi \"Chương trình Test Mùa Vụ Hè Thu\" (ID #14)',NULL,NULL,'2026-11-01 04:36:39'),(305,1,'CREATE_PROMOTION','PROMOTION','Tạo chương trình khuyến mãi mới: \"Chương trình Trùng Lặp BR-014\" (Giảm 15%)',NULL,NULL,'2026-11-01 04:36:39'),(306,1,'CREATE_PROMOTION','PROMOTION','Tạo chương trình khuyến mãi mới: \"Chương trình Test Mùa Vụ Hè Thu\" (Giảm 20%)',NULL,NULL,'2026-11-01 04:37:01'),(307,1,'CREATE_PROMOTION','PROMOTION','Tạo chương trình khuyến mãi mới: \"Chương trình Trùng Lặp BR-014\" (Giảm 15%)',NULL,NULL,'2026-11-01 04:37:01'),(308,1,'REMOVE_PROMOTION_PRODUCT','PROMOTION','Gỡ sản phẩm #23 khỏi chương trình khuyến mãi #16',NULL,NULL,'2026-11-01 04:37:01'),(309,1,'DELETE_PROMOTION','PROMOTION','Xóa chương trình khuyến mãi: \"Chương trình Test Mùa Vụ Hè Thu\" (ID #16)',NULL,NULL,'2026-11-01 04:37:02'),(310,1,'DELETE_PROMOTION','PROMOTION','Xóa chương trình khuyến mãi: \"Chương trình Trùng Lặp BR-014\" (ID #17)',NULL,NULL,'2026-11-01 04:37:02'),(311,1,'DELETE_PROMOTION','PROMOTION','Xóa chương trình khuyến mãi: \"Chương trình Trùng Lặp BR-014\" (ID #15)',NULL,NULL,'2026-11-01 04:37:18'),(312,1,'DELETE_PROMOTION','PROMOTION','Xóa chương trình khuyến mãi: \"Chương trình Test Mùa Vụ Hè Thu\" (ID #14)',NULL,NULL,'2026-11-01 04:37:28'),(313,1,'TOGGLE_PROMOTION','PROMOTION','Chuyển trạng thái khuyến mãi #13 (\"Lễ Hội Trái Cây Miệt Vườn\") sang: Đã dừng',NULL,NULL,'2026-11-01 04:37:51'),(314,1,'TOGGLE_PROMOTION','PROMOTION','Chuyển trạng thái khuyến mãi #13 (\"Lễ Hội Trái Cây Miệt Vườn\") sang: Đang áp dụng',NULL,NULL,'2026-11-01 04:37:52'),(315,1,'UPDATE_PROMOTION','PROMOTION','Cập nhật chương trình khuyến mãi ID #13: \"Lễ Hội Trái Cây Miệt Vườn\" (Giảm 15%)',NULL,NULL,'2026-11-01 04:38:19'),(316,1,'TOGGLE_PROMOTION','PROMOTION','Chuyển trạng thái khuyến mãi #13 (\"Lễ Hội Trái Cây Miệt Vườn\") sang: Đã dừng',NULL,NULL,'2026-11-01 04:38:23'),(317,1,'ASSIGN_PROMOTION_PRODUCTS','PROMOTION','Gán 1 sản phẩm vào chương trình khuyến mãi \"Lễ Hội Trái Cây Miệt Vườn\" (ID #13)',NULL,NULL,'2026-11-01 04:39:16'),(318,1,'ASSIGN_PROMOTION_PRODUCTS','PROMOTION','Gán 1 sản phẩm vào chương trình khuyến mãi \"Lễ Hội Trái Cây Miệt Vườn\" (ID #13)',NULL,NULL,'2026-11-01 04:39:21'),(319,1,'ASSIGN_PROMOTION_PRODUCTS','PROMOTION','Gán 1 sản phẩm vào chương trình khuyến mãi \"Lễ Hội Trái Cây Miệt Vườn\" (ID #13)',NULL,NULL,'2026-11-01 04:39:26'),(320,1,'DELETE_PROMOTION','PROMOTION','Xóa chương trình khuyến mãi: \"Lễ Hội Trái Cây Miệt Vườn\" (ID #13)',NULL,NULL,'2026-11-01 04:40:13'),(321,1,'DELETE_PROMOTION','PROMOTION','Xóa chương trình khuyến mãi: \"Siêu Sale Mùa Thu Vàng\" (ID #12)',NULL,NULL,'2026-11-01 04:40:15'),(322,1,'DELETE_PROMOTION','PROMOTION','Xóa chương trình khuyến mãi: \"Siêu Sale Mùa Thu Vàng\" (ID #11)',NULL,NULL,'2026-11-01 04:40:17'),(323,1,'DELETE_PROMOTION','PROMOTION','Xóa chương trình khuyến mãi: \"Siêu Sale Mùa Thu Vàng\" (ID #10)',NULL,NULL,'2026-11-01 04:40:19'),(324,1,'DELETE_PROMOTION','PROMOTION','Xóa chương trình khuyến mãi: \"Lễ Hội Trái Cây Miệt Vườn\" (ID #9)',NULL,NULL,'2026-11-01 04:40:21'),(325,1,'DELETE_PROMOTION','PROMOTION','Xóa chương trình khuyến mãi: \"Lễ Hội Trái Cây Miệt Vườn\" (ID #8)',NULL,NULL,'2026-11-01 04:40:23'),(326,1,'DELETE_PROMOTION','PROMOTION','Xóa chương trình khuyến mãi: \"Lễ Hội Trái Cây Miệt Vườn\" (ID #7)',NULL,NULL,'2026-11-01 04:40:25'),(327,1,'DELETE_PROMOTION','PROMOTION','Xóa chương trình khuyến mãi: \"Lễ Hội Trái Cây Miệt Vườn\" (ID #6)',NULL,NULL,'2026-11-01 04:40:26'),(328,1,'DELETE_PROMOTION','PROMOTION','Xóa chương trình khuyến mãi: \"Lễ Hội Trái Cây Miệt Vườn\" (ID #5)',NULL,NULL,'2026-11-01 04:40:28'),(329,1,'DELETE_PROMOTION','PROMOTION','Xóa chương trình khuyến mãi: \"Lễ Hội Trái Cây Miệt Vườn\" (ID #4)',NULL,NULL,'2026-11-01 04:40:31'),(330,1,'DELETE_PROMOTION','PROMOTION','Xóa chương trình khuyến mãi: \"Lễ Hội Trái Cây Miệt Vườn\" (ID #3)',NULL,NULL,'2026-11-01 04:40:33'),(331,1,'DELETE_PROMOTION','PROMOTION','Xóa chương trình khuyến mãi: \"Lễ Hội Trái Cây Miệt Vườn\" (ID #2)',NULL,NULL,'2026-11-01 04:40:35'),(332,1,'DELETE_PROMOTION','PROMOTION','Xóa chương trình khuyến mãi: \"Lễ Hội Trái Cây Cực Đại\" (ID #1)',NULL,NULL,'2026-11-01 04:40:36'),(333,1,'CREATE_PROMOTION','PROMOTION','Tạo chương trình khuyến mãi mới: \"ga\" (Giảm 20%)',NULL,NULL,'2026-11-01 04:40:54'),(334,1,'ASSIGN_PROMOTION_PRODUCTS','PROMOTION','Gán 1 sản phẩm vào chương trình khuyến mãi \"ga\" (ID #18)',NULL,NULL,'2026-11-01 04:41:03'),(335,1,'CREATE_PROMOTION','PROMOTION','Tạo chương trình khuyến mãi mới: \"qẻ\" (Giảm 10%)',NULL,NULL,'2026-11-01 04:41:45'),(336,1,'TOGGLE_PROMOTION','PROMOTION','Chuyển trạng thái khuyến mãi #18 (\"ga\") sang: Đã dừng',NULL,NULL,'2026-11-01 04:56:13'),(337,1,'TOGGLE_PROMOTION','PROMOTION','Chuyển trạng thái khuyến mãi #19 (\"qẻ\") sang: Đã dừng',NULL,NULL,'2026-11-01 04:56:13'),(338,1,'TOGGLE_PROMOTION','PROMOTION','Chuyển trạng thái khuyến mãi #19 (\"qẻ\") sang: Đang áp dụng',NULL,NULL,'2026-11-01 17:38:49'),(339,1,'TOGGLE_PROMOTION','PROMOTION','Chuyển trạng thái khuyến mãi #19 (\"qẻ\") sang: Đã dừng',NULL,NULL,'2026-11-01 17:38:49'),(340,1,'TOGGLE_PROMOTION','PROMOTION','Chuyển trạng thái khuyến mãi #19 (\"qẻ\") sang: Đang áp dụng',NULL,NULL,'2026-11-01 17:38:50'),(341,1,'TOGGLE_PROMOTION','PROMOTION','Chuyển trạng thái khuyến mãi #18 (\"ga\") sang: Đang áp dụng',NULL,NULL,'2026-11-01 17:38:56'),(342,1,'LOGOUT','AUTH','Người dùng đăng xuất khỏi hệ thống (0929894248)',NULL,NULL,'2026-11-01 18:20:53'),(343,23,'AUTO_REGISTER','USER','Tự động tạo tài khoản khách hàng khi đặt hàng lần đầu: a',NULL,NULL,'2026-11-01 21:15:34'),(344,23,'CREATE','ORDER','Tạo đơn hàng mới mã OD202611015068 tổng tiền 4.200.000 đ',NULL,NULL,'2026-11-01 21:15:34'),(345,23,'CANCEL','ORDER','Hủy đơn hàng mã OD202611015068. Lý do: Muốn chọn loại trái cây khác',NULL,NULL,'2026-11-01 21:16:53'),(346,1,'UPDATE_PRODUCT','PRODUCT','Cập nhật thông tin sản phẩm ID #25: Dưa Hấu Không Hạt Mặt Trời Đỏ',NULL,NULL,'2026-11-01 21:19:39'),(347,24,'AUTO_REGISTER','USER','Tự động tạo tài khoản khách hàng khi đặt hàng lần đầu: 33',NULL,NULL,'2026-11-01 21:19:55'),(348,1,'PATCH_PRODUCT','PRODUCT','Điều chỉnh sản phẩm ID #25: Trạng thái -> Ẩn; ',NULL,NULL,'2026-11-01 21:20:54'),(349,1,'UPDATE_PRODUCT','PRODUCT','Cập nhật thông tin sản phẩm ID #25: Dưa Hấu Không Hạt Mặt Trời Đỏ',NULL,NULL,'2026-11-01 21:38:46'),(350,25,'AUTO_REGISTER','USER','Tự động tạo tài khoản khách hàng khi đặt hàng lần đầu: 0983569359',NULL,NULL,'2026-11-01 21:42:39'),(351,25,'CREATE','ORDER','Tạo đơn hàng mới mã OD202611014343 tổng tiền 175.000 đ',NULL,NULL,'2026-11-01 21:42:39'),(352,25,'CANCEL','ORDER','Hủy đơn hàng mã OD202611014343. Lý do: Khách đổi ý',NULL,NULL,'2026-11-01 21:42:39'),(353,19,'LOGOUT','AUTH','Người dùng đăng xuất khỏi hệ thống (0901234567)',NULL,NULL,'2026-11-01 21:48:14'),(354,26,'AUTO_REGISTER','USER','Tự động tạo tài khoản khách hàng khi đặt hàng lần đầu: 0987654311',NULL,NULL,'2026-11-01 21:48:35'),(355,26,'CREATE','ORDER','Tạo đơn hàng mới mã OD202611019437 tổng tiền 175.000 đ',NULL,NULL,'2026-11-01 21:48:35'),(356,27,'AUTO_REGISTER','USER','Tự động tạo tài khoản khách hàng khi đặt hàng lần đầu: 0913449843',NULL,NULL,'2026-11-01 22:22:51'),(357,28,'AUTO_REGISTER','USER','Tự động tạo tài khoản khách hàng khi đặt hàng lần đầu: 0919999999',NULL,NULL,'2026-11-01 22:23:00'),(358,29,'AUTO_REGISTER','USER','Tự động tạo tài khoản khách hàng khi đặt hàng lần đầu: 0911172198',NULL,NULL,'2026-11-01 22:23:26'),(359,29,'CREATE','ORDER','Tạo đơn hàng mới mã OD202611019111 tổng tiền 100.000 đ',NULL,NULL,'2026-11-01 22:23:26'),(360,29,'CHANGE_PASSWORD','CUSTOMER','Thay đổi mật khẩu thành công',NULL,NULL,'2026-11-01 22:23:27'),(361,30,'REGISTER','USER','Khách hàng đăng ký tài khoản thành công qua xác thực OTP: 0379137069',NULL,NULL,'2026-11-01 23:07:06'),(362,30,'FORGOT_PASSWORD','AUTH','Yêu cầu gửi OTP khôi phục mật khẩu đến SĐT: 0379137069',NULL,NULL,'2026-11-01 23:08:03'),(363,2,'RESET_PASSWORD','AUTH','Đặt lại mật khẩu thành công qua xác thực OTP cho SĐT: 0912345678',NULL,NULL,'2026-11-01 23:12:36'),(364,2,'RESET_PASSWORD','AUTH','Đặt lại mật khẩu thành công qua xác thực OTP cho SĐT: 0912345678',NULL,NULL,'2026-11-01 23:12:46'),(365,2,'RESET_PASSWORD','AUTH','Đặt lại mật khẩu thành công qua xác thực OTP cho SĐT: 0912345678',NULL,NULL,'2026-11-01 23:12:46'),(366,31,'AUTO_REGISTER','USER','Tự động tạo tài khoản khách hàng khi đặt hàng lần đầu: 0123456789',NULL,NULL,'2026-11-01 23:54:36'),(367,31,'CREATE','ORDER','Tạo đơn hàng mới mã OD202611015516 tổng tiền 100.000 đ',NULL,NULL,'2026-11-01 23:54:36'),(368,31,'CANCEL','ORDER','Hủy đơn hàng mã OD202611015516. Lý do: Đổi ý không mua nữa',NULL,NULL,'2026-11-02 00:21:59'),(369,31,'CREATE','ORDER','Tạo đơn hàng mới mã OD202611021042 tổng tiền 100.000 đ',NULL,NULL,'2026-11-02 00:22:11'),(370,31,'CREATE','ORDER','Tạo đơn hàng mới mã OD202611026281 tổng tiền 100.000 đ',NULL,NULL,'2026-11-02 00:25:14'),(371,31,'CREATE','ORDER','Tạo đơn hàng mới mã OD202611021177 tổng tiền 100.000 đ',NULL,NULL,'2026-11-02 00:25:58');
/*!40000 ALTER TABLE `system_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_permissions`
--

DROP TABLE IF EXISTS `user_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_permissions`
--

LOCK TABLES `user_permissions` WRITE;
/*!40000 ALTER TABLE `user_permissions` DISABLE KEYS */;
INSERT INTO `user_permissions` VALUES (22,14,6,'2026-11-01 02:28:20'),(23,14,7,'2026-11-01 02:28:20'),(24,14,8,'2026-11-01 02:28:20'),(25,14,16,'2026-11-01 02:28:20'),(26,14,13,'2026-11-01 02:28:20'),(27,14,10,'2026-11-01 02:28:20'),(28,14,17,'2026-11-01 02:28:20'),(29,14,18,'2026-11-01 02:28:20'),(30,14,9,'2026-11-01 02:28:20'),(31,14,5,'2026-11-01 02:28:20'),(32,14,1,'2026-11-01 02:28:20'),(33,14,2,'2026-11-01 02:28:20'),(34,14,3,'2026-11-01 02:28:20'),(35,14,4,'2026-11-01 02:28:20'),(36,14,12,'2026-11-01 02:28:20');
/*!40000 ALTER TABLE `user_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `role_id` bigint unsigned NOT NULL COMMENT 'Khóa ngoại tới bảng roles',
  `branch_id` bigint unsigned DEFAULT NULL COMMENT 'Khóa ngoại tới branches (nếu là quản trị chi nhánh)',
  `full_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Họ và tên',
  `phone` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Số điện thoại duy nhất dùng đăng nhập',
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Mật khẩu đã mã hóa',
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Địa chỉ mặc định',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1: Hoạt động, 0: Bị khóa',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_phone_unique` (`phone`),
  KEY `users_role_id_foreign` (`role_id`),
  KEY `users_branch_id_foreign` (`branch_id`),
  CONSTRAINT `users_branch_id_foreign` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`) ON DELETE SET NULL,
  CONSTRAINT `users_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Quản lý tài khoản người dùng';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,1,NULL,'Trần Vũ (Admin Tổng)','0929894248','123456','53 Võ Văn Ngân, Thủ Đức',1,'2026-10-28 06:30:18','2026-10-30 21:50:46',NULL),(2,2,1,'Quản Lý Q1 Cập Nhật','0912345678','Admin@123456','thủ đức',1,'2026-10-28 09:34:27','2026-11-01 23:12:46',NULL),(3,3,NULL,'Tài Khoản Bị Khóa Demo','0900000000','123456','TP.HCM',0,'2026-10-28 10:02:58','2026-10-30 19:18:37',NULL),(14,2,13,'Quản Lý Chi Nhánh Word','0920407124','123456','Trụ sở chi nhánh',1,'2026-10-30 19:48:54','2026-11-01 01:52:28',NULL),(19,3,NULL,'Khách Hàng Thử Nghiệm FR5','0901234567','password123','77 Đường Số 9, P. Linh Chiểu',1,'2026-10-30 20:44:17','2026-10-30 22:26:58',NULL),(22,3,NULL,'ư','0987654321','123456','ư',1,'2026-11-01 04:14:56','2026-11-01 04:14:56',NULL),(23,3,NULL,'s','a','123456','q',1,'2026-11-01 21:15:34','2026-11-01 21:15:34',NULL),(24,3,NULL,'ewq','33','123456','2weq',1,'2026-11-01 21:19:55','2026-11-01 21:19:55',NULL),(25,3,NULL,'Khách Test SRS','0983569359','123456','456 Kha Vạn Cân, TP Thủ Đức',1,'2026-11-01 21:42:39','2026-11-01 21:42:39',NULL),(26,3,NULL,'e','0987654311','123456','f',1,'2026-11-01 21:48:35','2026-11-01 21:48:35',NULL),(27,3,NULL,'Test Auto Customer','0913449843','mySecretPassword123','123 Đường Số 9, P. Linh Chiểu, TP. Thủ Đức',1,'2026-11-01 22:22:51','2026-11-01 22:22:51',NULL),(28,3,NULL,'Test','0919999999','123456','123',1,'2026-11-01 22:23:00','2026-11-01 22:23:00',NULL),(29,3,NULL,'Test Auto Customer','0911172198','newSuperPassword999','123 Đường Số 9, P. Linh Chiểu, TP. Thủ Đức',1,'2026-11-01 22:23:26','2026-11-01 22:23:27',NULL),(30,3,NULL,'Trần Hà','0379137069','123456','Phan Thiet',1,'2026-11-01 23:07:06','2026-11-01 23:07:06',NULL),(31,3,NULL,'Vu khoa','0123456789','123456','HCM',1,'2026-11-01 23:54:36','2026-11-01 23:54:36',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-02 13:18:15
