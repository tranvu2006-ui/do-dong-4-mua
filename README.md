# 🍉 ĐỒ ĐỒNG 4 MÙA — Hệ Thống Thương Mại Điện Tử Nông Sản & Trái Cây Đặc Sản 4 Mùa

> **Dự án Chuyên ngành / Đồ án Tốt nghiệp theo Tài liệu Đặc tả Yêu cầu Phần mềm (SRS V1.0)**  
> **Nhóm sinh viên thực hiện:**  
> - **Trần Vũ** (MSSV: 24211TT2515)  
> - **Hồ Thị Vân Anh** (MSSV: 24211TT3786)  
> 
> **Môi trường triển khai thực tế (Production):** [https://dodongbonmua.duckdns.org](https://dodongbonmua.duckdns.org)  
> **Mã nguồn GitHub:** [https://github.com/tranvu2006-ui/do-dong-4-mua](https://github.com/tranvu2006-ui/do-dong-4-mua)  
> **Docker Image (GHCR):** `ghcr.io/tranvu2006-ui/dodong4mua:v5` (Linux amd64)

---

## 🌟 1. Tổng Quan Dự Án & Kiến Trúc Công Nghệ

**Đồ Đồng 4 Mùa** là nền tảng thương mại điện tử chuyên cung cấp trái cây tươi và nông sản sạch theo mùa tại Việt Nam. Hệ thống được phát triển theo mô hình kiến trúc hiện đại, tuân thủ nghiêm ngặt tài liệu SRS, tích hợp trọn vẹn quy trình bán lẻ từ giỏ hàng, đặt hàng, thanh toán VietQR động, tạo vận đơn bàn giao đơn vị vận chuyển, đến phân hệ quản trị (Admin Dashboard) với báo cáo phân tích KPI đa chiều.

### Công Nghệ Áp Dụng (Full-stack Tech Stack):
- **Fullstack Framework:** Next.js 16.4.5 (App Router, Turbopack, Server-side Rendering & Route Handlers `/api/...`).
- **Giao diện Người dùng (Frontend):** React 19, Tailwind CSS 3.4 (Utility-first styling), Lucide React Icons.
- **Cơ sở dữ liệu (Database):** MySQL 8.4 LTS với 20 bảng quan hệ toàn vẹn dữ liệu (Foreign Keys, Indexes, Triggers).
- **Trình xuất Báo cáo Doanh nghiệp:**
  - **Excel (.xlsx):** `ExcelJS 4.4` tạo bảng tính Office 365 chuẩn doanh nghiệp (bố cục thương hiệu Emerald Green, khối tóm tắt KPI, xen kẽ dòng zebra striping, định dạng tiền tệ `#,##0 "đ"`, giữ nguyên số `0` ở đầu số điện thoại).
  - **Báo cáo PDF:** `pdf-lib 1.17` kết hợp `@pdf-lib/fontkit` biên dịch trực tiếp hóa đơn và báo cáo PDF nhúng font tiếng Việt.
- **Bảo mật & Kiểm toán:**
  - Mã hóa mật khẩu bảo mật chuẩn công nghiệp với `bcryptjs`.
  - Cơ chế phân quyền RBAC (Role-Based Access Control) chi tiết theo từng phân hệ.
  - Bảng ghi kiểm toán bất biến `system_logs` (Audit Trail) ghi lại mọi thao tác thêm, sửa, xóa, duyệt đơn và đăng nhập kèm IP, User-Agent.
- **Hạ tầng Vận hành DevOps:**
  - Đóng gói container đa tầng (Multi-stage Dockerfile) trên nền tảng siêu nhẹ `node:22-alpine`.
  - Điều phối container tự động bằng Docker Compose (`compose.prod.yml`).
  - Reverse Proxy Caddy 2 tự động cấp phát và gia hạn chứng chỉ bảo mật HTTPS SSL từ Let's Encrypt.

---

## 💎 2. Nghiệp Vụ Cốt Lõi & Điểm Nhấn Chuẩn SRS

### A. Giao Diện & Bộ Nhận Diện Thương Hiệu (SRS Chương 10)
- **Tông màu chủ đạo:** Xanh ngọc lục bảo thương hiệu (`#047857` / `#065F46`), Nền sáng nhẹ (`#F8FAFC`), Cam khuyến mãi rực rỡ (`#EA580C`), Đỏ cảnh báo tồn kho (`#E11D48`).
- **Khả năng tương thích 100% Responsive:** Tối ưu hóa trải nghiệm trên Mobile (< 768px), Tablet (768px - 1024px) và Desktop màn hình rộng (> 1024px).
- **Quy chuẩn ngày tháng toàn hệ thống:** Đồng bộ duy nhất một định dạng ngày tháng tiêu chuẩn Việt Nam `dd/mm/yyyy` (và thời gian `HH:mm dd/mm/yyyy`) trên toàn bộ bảng dữ liệu, bộ lọc, hóa đơn PDF và file xuất Excel.

### B. Mua Sắm & Đặt Hàng Trực Tuyến (Storefront)
- **Danh mục nông sản đa dạng:** Phân loại theo mùa (Xuân, Hạ, Thu, Đông), giỏ quà biếu, combo trái cây và hàng nhập khẩu cao cấp.
- **Giỏ hàng động (Slide-over Cart Drawer):** Thêm nhanh vào giỏ, cập nhật số lượng tức thời và lưu trữ phiên mua sắm.
- **Thanh toán linh hoạt:**
  - Thanh toán tiền mặt khi nhận hàng (COD).
  - Quét mã VietQR động tự động sinh mã QR ngân hàng kèm số tài khoản và đúng chính xác số tiền đơn hàng.
- **Theo dõi lộ trình giao hàng thời gian thực (`/don-hang/[code]`):** Quy trình 5 bước minh bạch: *Chờ xác nhận* ➔ *Đã xác nhận* ➔ *Đang chuẩn bị* ➔ *Đang giao hàng* ➔ *Đã giao thành công*.

### C. Phân Hệ Quản Trị Hệ Thống Toàn Năng (Admin Portal `/admin`)
Hệ thống quản trị chia làm 11 phân hệ chức năng chuyên nghiệp:
1. **Tổng quan (Dashboard):** Biểu đồ doanh thu thực tế, số lượng đơn hàng mới, sản phẩm bán chạy nhất, cảnh báo hàng sắp hết.
2. **Quản lý Sản phẩm:** Thêm mới, chỉnh sửa thông tin, tải lên bộ sưu tập ảnh, quản lý giá gốc và giá khuyến mãi.
3. **Quản lý Danh mục & Banner:** Phân loại sản phẩm và điều hành banner khuyến mãi trang chủ theo chiến dịch.
4. **Quản lý Đơn hàng:** Tra cứu, lọc theo trạng thái, duyệt đơn, chuyển trạng thái đóng gói, tạm dừng hoặc hủy đơn kèm lý do.
5. **Quản lý Khách hàng:** Hồ sơ khách hàng, lịch sử mua sắm tích lũy, chức năng khóa / mở khóa tài khoản an toàn.
6. **Quản lý Phân quyền (RBAC):** Cấp quyền chi tiết theo từng chức năng cho Quản trị viên Chi nhánh.
7. **Phân hệ Báo Cáo & Thống Kê Chuyên Sâu (FR-047 đến FR-050):**
   - **Báo cáo Doanh thu (FR-047 & BR-028):** Doanh thu được tính chính xác dựa trên các đơn hàng có trạng thái *Đã giao thành công*.
   - **Báo cáo Khách hàng (FR-048):** Định danh duy nhất bằng Số Điện Thoại; phân tích chi tiêu tích lũy, đơn thành công và đơn hủy.
   - **Báo cáo Hàng Tồn Kho (FR-049 & BR-029):** Giám sát thời gian thực số lượng tồn kho; tự động gắn huy hiệu cảnh báo *Hết hàng* (Tồn = 0), *Sắp hết hàng* (Tồn ≤ 10) và ước tính tổng giá trị vốn lưu kho.
   - **Báo cáo Đơn Hàng (FR-050):** Thống kê số lượng đơn chờ xử lý, đơn đang giao, đơn thành công, tỷ lệ hoàn tất đơn hàng.
   - **Bộ lọc ngày thông minh:** Các nút chọn nhanh (*Hôm nay*, *7 ngày qua*, *30 ngày qua*, *Toàn thời gian*) có hiệu ứng highlight màu sắc riêng biệt và tính toán theo múi giờ địa phương Việt Nam.
   - **Xuất báo cáo đa định dạng:** Nút *Xuất File Excel (.xlsx)* tạo file Office 365 hoàn hảo và nút *Xuất PDF* tạo file in hóa đơn/báo cáo tức thì.
8. **Nhật ký Kiểm toán Hệ thống (System Logs):** Lưu vết toàn bộ hoạt động của quản trị viên bằng ngôn ngữ tự nhiên tiếng Việt, hỗ trợ tra cứu địa chỉ IP và trình duyệt thực hiện.
9. **Cấu hình Hệ thống (System Settings):** Quản lý đối tác vận chuyển, quy chuẩn tiền tệ, định dạng ngày tháng và tùy biến thông tin liên hệ.

---

## 🗄️ 3. Cấu Trúc Cơ Sở Dữ Liệu 20 Bảng Chuẩn Hóa

Toàn bộ lược đồ cơ sở dữ liệu được thiết kế tối ưu, kiểm thử chạy hoàn hảo trên MySQL 8.4:

| STT | Tên Bảng | Vai Trò & Chức Năng Nghiệp Vụ |
| :---: | :--- | :--- |
| 1 | `roles` | Danh mục vai trò người dùng (Admin Tổng, Admin Chi nhánh, Khách hàng) |
| 2 | `permissions` | Danh sách 24+ mã quyền chức năng của hệ thống |
| 3 | `role_permissions` | Bảng liên kết phân bổ quyền hạn cho từng vai trò |
| 4 | `branches` | Danh sách chi nhánh cửa hàng thực tế |
| 5 | `users` | Tài khoản quản trị viên và khách hàng thành viên |
| 6 | `categories` | Danh mục sản phẩm (Trái cây mùa hè, Nhập khẩu, Giỏ quà biếu...) |
| 7 | `products` | Thông tin mặt hàng nông sản, đơn vị tính (`kg`, `hộp`, `giỏ`), giá bán, tồn kho |
| 8 | `product_images` | Bộ sưu tập nhiều hình ảnh chi tiết cho từng sản phẩm |
| 9 | `promotions` | Các chương trình khuyến mãi theo mùa và mã giảm giá |
| 10 | `promotion_products` | Danh sách sản phẩm được áp dụng trong chương trình khuyến mãi |
| 11 | `carts` | Giỏ hàng của người dùng |
| 12 | `cart_items` | Danh sách mặt hàng và số lượng lưu trữ trong giỏ hàng |
| 13 | `orders` | Đơn hàng của khách hàng (`order_code`, người nhận, tổng tiền, trạng thái đơn) |
| 14 | `order_details` | Chi tiết từng sản phẩm, số lượng và đơn giá tại thời điểm đặt |
| 15 | `payments` | Lịch sử thanh toán giao dịch (`COD`, `VIETQR`, `MOMO`) và trạng thái đối soát |
| 16 | `shipments` | Dữ liệu vận chuyển và theo dõi lộ trình đơn hàng |
| 17 | `banners` | Banner quảng cáo, tiếp thị và sự kiện trên trang chủ |
| 18 | `shipping_fee_rules` | Bảng cấu hình biểu phí giao hàng theo khu vực và ngưỡng miễn phí vận chuyển |
| 19 | `system_settings` | Bảng lưu trữ cấu hình hệ thống toàn cục |
| 20 | `system_logs` | Bảng lưu trữ nhật ký kiểm toán bất biến (Audit Trail) của hệ thống |

---

## 🚀 4. Hướng Dẫn Cài Đặt & Vận Hành

### Cách 1: Chạy Môi Trường Local Development

Yêu cầu máy tính cài đặt Node.js 22+ và hệ quản trị MySQL 8.0+.

```bash
# 1. Di chuyển vào thư mục dự án
cd "c:\DuAn\Do dong 4 mua"

# 2. Cài đặt các gói thư viện
npm install

# 3. Tạo file biến môi trường .env.local
cat << 'EOF' > .env.local
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=do_dong_4_mua
DB_USER=root
DB_PASSWORD=your_mysql_password
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF

# 4. Nạp cơ sở dữ liệu mẫu
mysql -u root -p do_dong_4_mua < database/do_dong_4_mua.sql

# 5. Khởi chạy máy chủ phát triển
npm run dev

# 6. Truy cập ứng dụng tại trình duyệt:
# - Giao diện Khách hàng: http://localhost:3000
# - Giao diện Quản trị:   http://localhost:3000/admin
```

---

### Cách 2: Đóng Gói & Triển Khai Bằng Docker (Production VPS)

```bash
# 1. Đóng gói Docker image kiến trúc amd64
docker build --platform linux/amd64 -t ghcr.io/tranvu2006-ui/dodong4mua:v5 .

# 2. Đẩy Docker image lên kho lưu trữ GitHub Packages
docker push ghcr.io/tranvu2006-ui/dodong4mua:v5

# 3. Khởi động cụm dịch vụ hoàn chỉnh trên VPS (Next.js + MySQL 8.4 + Caddy Proxy)
docker compose -f compose.prod.yml pull
docker compose -f compose.prod.yml up -d

# 4. Kiểm tra sức khỏe toàn hệ thống
curl -i https://dodongbonmua.duckdns.org/api/health
```

---

## 🔐 5. Thông Tin Tài Khoản Khởi Tạo Mặc Định

Cơ sở dữ liệu được làm sạch chuẩn hóa, khởi tạo duy nhất 01 tài khoản Admin Tổng có toàn quyền quản trị:

| Vai Trò | Số Điện Thoại | Mật Khẩu | Quyền Hạn & Ghi Chú |
| :--- | :---: | :---: | :--- |
| **Admin Tổng (Super Admin)** | `0929894248` | `123@Vu456` | Toàn quyền hệ thống, cấu hình website, phân quyền Quản trị viên chi nhánh và quản lý toàn bộ báo cáo doanh thu |

> [!NOTE]
> **Các tài khoản khác được tạo động theo đúng quy trình nghiệp vụ:**
> - **Quản trị viên Chi nhánh:** Do Admin Tổng trực tiếp tạo mới và phân quyền theo từng chi nhánh tại phân hệ *Quản lý phân quyền* (`/admin?tab=permissions`).
> - **Khách hàng:** Người dùng tự tạo tài khoản thông qua trang *Đăng ký* (`/dang-ky`) hoặc được hệ thống tự động khởi tạo khi tiến hành đặt hàng lần đầu.

---

## 📄 6. Bản Quyền & Giấy Phép
Dự án được xây dựng và phát triển vì mục đích học tập, nghiên cứu và phục vụ đồ án tốt nghiệp chuyên ngành Kỹ thuật Phần mềm. Bản quyền thuộc về Nhóm tác giả **Trần Vũ & Hồ Thị Vân Anh (2026)**.
