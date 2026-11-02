# 🍉 ĐỔ ĐỐNG 4 MÙA — Website Bán Trái Cây 4 Mùa Đặc Sản

> **Đồ án môn học / Dự án tốt nghiệp theo tài liệu đặc tả SRS V1.0**  
> **Nhóm sinh viên thực hiện:**  
> - **Trần Vũ** (MSSV: 24211TT2515)  
> - **Hồ Thị Vân Anh** (MSSV: 24211TT3786)  
> 
> **Công nghệ áp dụng:**  
> - **Backend (BE):** Node.js 24 + Next.js App Router (Route Handlers `/api/...`)  
> - **Frontend (FE):** React 19 + Tailwind CSS + Lucide Icons  
> - **Cơ sở dữ liệu:** MySQL 8.4 (`do_dong_4_mua` — 18 bảng chuẩn SRS Chương 9)  
> - **Vận hành & Triển khai:** Docker Compose + Reverse Proxy Caddy tự động cấp SSL HTTPS  

---

## 🌟 1. Điểm nổi bật & Nghiệp vụ cốt lõi (SRS)

1. **Bộ nhận diện chuẩn SRS Chương 10:**
   - Tone màu chủ đạo: Xanh thương hiệu (`#2E7D32`), Nền (`#E8F5E9`), Khuyến mãi Cam (`#FF9800`), Cảnh báo Đỏ (`#E53935`).
   - Giao diện đáp ứng 100% Responsive trên Mobile (<768px), Tablet (768–1024px) và Desktop (>1024px).
2. **Quản lý danh mục 4 Mùa (Xuân – Hạ – Thu – Đông):**
   - 🌸 **Mùa Xuân:** Dưa hấu Mặt Trời Đỏ, Bưởi Diễn Hà Nội, Xoài Cát Hòa Lộc...
   - ☀️ **Mùa Hạ:** Sầu riêng Ri6 Bến Tre, Vải thiều Lục Ngạn, Măng cụt Lái Thiêu...
   - 🍂 **Mùa Thu:** Hồng giòn Đà Lạt, Na dai Chi Lăng, Bưởi da xanh Bến Tre...
   - ❄️ **Mùa Đông:** Cam sành Hàm Yên, Nho Mẫu Đơn Nhật Bản, Dâu tây Mộc Châu...
3. **Giỏ hàng & Đặt hàng (Checkout):**
   - Giỏ hàng động với hiệu ứng trượt (Slide-over Cart Drawer).
   - Tự động tính miễn phí vận chuyển khi đơn hàng từ 500.000đ trở lên.
   - Hỗ trợ 3 hình thức thanh toán: COD (Tiền mặt), Mã QR VietQR động (quét mã tự động điền STK & số tiền), Ví MoMo.
4. **Đối tác vận chuyển GreenSM:**
   - Đơn hàng tự động sinh mã vận đơn GreenSM chuẩn `GSM-VN-YYYYMMDD-XXXX`.
   - Trang theo dõi lộ trình thời gian thực (`/don-hang/[code]`) với 5 bước trực quan: Chờ xác nhận ➔ Đã xác nhận ➔ Đang đóng gói ➔ Đang giao xe điện GreenSM ➔ Giao thành công.
5. **Cổng Quản Trị Hệ Thống (Admin Dashboard `/admin`):**
   - Thống kê thời gian thực: Tổng doanh thu, Tổng đơn hàng, Sản phẩm đang bán, Cảnh báo tồn kho thấp.
   - Quản lý & duyệt trạng thái đơn hàng (Duyệt đơn ➔ Giao GreenSM ➔ Hoàn tất).
   - Thêm mới sản phẩm trái cây và quản lý giá niêm yết / giá khuyến mãi.
   - Báo cáo top sản phẩm bán chạy nhất.

---

## 🗄️ 2. Cấu trúc Cơ sở dữ liệu 18 Bảng (SRS Chương 9)

CSDL được thiết kế và kiểm thử chuẩn trên MySQL 8.4:
1. `roles`: Vai trò người dùng (Admin Tổng, Admin Chi nhánh, Khách hàng).
2. `permissions`: Danh mục quyền hệ thống.
3. `role_permissions`: Liên kết vai trò – quyền hạn.
4. `branches`: Chi nhánh cửa hàng (Thủ Đức & Quận 1).
5. `users`: Tài khoản quản trị và khách hàng.
6. `categories`: Danh mục sản phẩm (Trái cây theo mùa, Nhập khẩu, Giỏ quà, Combo).
7. `products`: Sản phẩm trái cây, đơn vị tính (`kg`, `giỏ`, `combo`, `hộp`), giá & khuyến mãi.
8. `product_images`: Thư viện ảnh chi tiết từng sản phẩm.
9. `promotions`: Chương trình khuyến mãi theo mùa.
10. `promotion_products`: Gán sản phẩm vào chương trình khuyến mãi.
11. `carts`: Giỏ hàng người dùng.
12. `cart_items`: Chi tiết các mặt hàng trong giỏ.
13. `orders`: Đơn hàng khách đặt (`order_code`, địa chỉ, trạng thái đơn).
14. `order_details`: Chi tiết sản phẩm trong đơn hàng.
15. `payments`: Lịch sử và phương thức thanh toán (`COD`, `VIETQR`, `MOMO`).
16. `shipments`: Thông tin vận đơn đối tác GreenSM (`tracking_code`, lộ trình giao hàng).
17. `banners`: Banner quảng cáo & khuyến mãi trang chủ.
18. `system_logs`: Nhật ký kiểm toán thao tác hệ thống (Audit Trail).

---

## 🚀 3. Hướng dẫn chạy dự án

### Cách 1: Chạy trực tiếp (Local Development)

```bash
# 1. Cài đặt các thư viện phụ thuộc
npm install

# 2. Cấu hình biến môi trường tại .env.local
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=do_dong_4_mua
DB_USER=dodong4mua_user
DB_PASSWORD=Dodong4mua@Password2026

# 3. Khởi chạy ứng dụng Next.js
npm run dev
# Truy cập giao diện tại: http://localhost:3000
```

### Cách 2: Chạy toàn bộ bằng Docker Compose

```bash
# Khởi động cụm dịch vụ: MySQL 8.4 + Next.js App + Caddy Proxy
docker compose up -d --build

# Kiểm tra trạng thái container
docker compose ps
```

---

## 📡 4. Danh sách RESTful API Endpoints

| Phương thức | Endpoint | Mô tả |
| :--- | :--- | :--- |
| `GET` | `/api/products` | Lấy danh sách sản phẩm (hỗ trợ lọc theo `season`, `category`, `search`, `sort`) |
| `POST` | `/api/products` | Thêm mới sản phẩm trái cây (dành cho Admin) |
| `GET` | `/api/products/[id]` | Chi tiết sản phẩm, ảnh gallery và sản phẩm tương tự |
| `PUT` | `/api/products/[id]` | Cập nhật thông tin / giá bán / tồn kho sản phẩm |
| `DELETE`| `/api/products/[id]` | Ẩn sản phẩm khỏi danh sách bán |
| `GET` | `/api/categories` | Lấy danh sách danh mục và số lượng sản phẩm |
| `GET` | `/api/banners` | Danh sách banner quảng cáo trang chủ |
| `GET` | `/api/branches` | Danh sách chi nhánh cửa hàng |
| `GET` | `/api/promotions` | Danh sách khuyến mãi đang có hiệu lực |
| `GET` | `/api/orders` | Danh sách đơn hàng (hỗ trợ lọc trạng thái) |
| `POST` | `/api/orders` | Tạo đơn hàng mới, khởi tạo thanh toán & sinh vận đơn GreenSM |
| `GET` | `/api/orders/[code]` | Lấy chi tiết đơn hàng & trạng thái vận đơn theo mã đơn |
| `PATCH`| `/api/orders/[code]` | Cập nhật trạng thái đơn hàng & trạng thái vận chuyển GreenSM |
| `GET` | `/api/admin/stats` | Thống kê doanh thu, đơn hàng, tồn kho và top sản phẩm |
| `POST` | `/api/auth` | Đăng nhập tài khoản Admin hoặc Khách hàng |

---

## 🔐 5. Tài khoản dùng thử

- **Admin Tổng:** SĐT `0988888888` | Mật khẩu: `Admin@123456`
- **Khách hàng mẫu:** SĐT `0912345678` | Mật khẩu: `123456`

