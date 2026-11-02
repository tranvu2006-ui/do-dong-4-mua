# DEPLOY.md — Góc Đồ Cũ (Buổi 13)

> Viết cho **người khác** làm theo được: người đó biết `ssh` và Docker, nhưng chưa từng thấy dự án này
> và không hỏi được ai. Mỗi bước: **lệnh** (chép được) + **viết bằng lời của em** bước đó làm gì + **đúng khi…**
> + **thời gian em đo được**. Buổi 16 sẽ mổ xẻ tờ này; buổi 18 biến nó thành `deploy.sh` cho máy chạy.

## 0. Thông tin máy chủ

| Mục | Giá trị |
|---|---|
| Nhà cung cấp | Azure for Students — `Standard_B2ats_v2` (1 GiB + swap 2 GB), Korea Central |
| IP | `72.155.73.216` |
| Tên miền | `tranvu2006-gocdocu.duckdns.org` (Tùy chọn trỏ DuckDNS) |
| Đăng nhập | `ssh may-chu` (user `sv`, chỉ nhận khoá SSH Ed25519) |
| Thư mục | `/opt/goc-do-cu` — đúng 3 file: `compose.prod.yml`, `Caddyfile`, `.env` |
| Image | `ghcr.io/tranvu2006-ui/goc-do-cu:v1` — tag đang chạy: `grep IMAGE_TAG /opt/goc-do-cu/.env` |
| Tường lửa | ufw: 22/80/443. NSG Azure: 22/80/443 |
| Bí mật nằm ở đâu | `.env` trên máy chủ (quyền 600). Token đọc ghcr: `~/.docker/config.json` trên máy chủ. **Không ghi giá trị mật khẩu vào file này** |

## 1. Tám bước triển khai

| # | Ở đâu | Lệnh | Bằng lời của em | Đúng khi… | Phút |
|---|---|---|---|---|---|
| 1 | Laptop | `docker build --platform linux/amd64 -t ghcr.io/tranvu2006-ui/goc-do-cu:v1 .` rồi `docker push ghcr.io/tranvu2006-ui/goc-do-cu:v1` | Đóng gói mã nguồn thành Docker image chuẩn amd64 và đẩy lên kho lưu trữ GitHub Packages | push in ra `digest: sha256:...` và thấy package trên github.com | 3 |
| 2 | Laptop | `ssh may-chu 'sudo mkdir -p /opt/goc-do-cu && sudo chown sv:sv /opt/goc-do-cu'` rồi chép `compose.prod.yml` và `Caddyfile` vào `/opt/goc-do-cu/` | Tạo thư mục chạy app trên VPS và đưa 2 file cấu hình hạ tầng lên | `ssh may-chu ls -la /opt/goc-do-cu` thấy đủ 2 file | 1 |
| 3 | Máy chủ | `cd /opt/goc-do-cu && bash ~/tao-env-may-chu.sh tranvu2006-ui v1` | Tự động sinh file `.env` với mật khẩu CSDL và APP_KEY ngẫu nhiên, phân quyền bảo mật 600 | In ra `Đã tạo /opt/goc-do-cu/.env (quyền 600)` | 1 |
| 4 | Máy chủ | `docker login ghcr.io -u tranvu2006-ui` (dán Personal Access Token) | Đăng nhập vào GitHub Packages để máy chủ có quyền tải image về | Terminal thông báo `Login Succeeded` | 1 |
| 5 | Máy chủ | `docker compose -f compose.prod.yml pull` | Kéo toàn bộ 3 image (`app`, `mysql:8.4`, `caddy:2`) từ internet về VPS | Không báo lỗi, tải đủ 3 image | 2 |
| 6 | Máy chủ | `docker compose -f compose.prod.yml run --rm app php bin/migrate.php` | Khởi chạy container tạm, chờ MySQL sẵn sàng rồi tạo các bảng CSDL | In ra danh sách migration và 4 bảng tạo thành công | 1 |
| 7 | Máy chủ | `docker compose -f compose.prod.yml up -d` | Khởi động toàn bộ 3 container chạy ngầm (background) | `docker compose -f compose.prod.yml ps`: db `(healthy)`, app và proxy `Up` | 1 |
| 8 | Máy chủ + điện thoại | `curl -i http://localhost/health` rồi mở `http://72.155.73.216` bằng 4G | Kiểm tra API sức khỏe trả về 200, tạo tài khoản admin và dùng 4G điện thoại đăng nhập, đăng 1 món đồ | `HTTP/1.1 200 OK`, điện thoại mở được web và đăng bài thành công | 2 |
| | | | | **Tổng** | **12 phút** |

**Chỉ lần đầu** (sau bước 7): tạo tài khoản quản trị:

```bash
docker compose -f compose.prod.yml exec -T -e EMAIL=admin@nhom1.vn -e TEN='Quan tri vien' -e MAT_KHAU="MatKhau@123456" app php < ~/tao-tai-khoan.php
```

**Nghiệm thu sau triển khai:**
- Trên máy chủ: `bash ~/kiem-tra-trien-khai.sh` $\rightarrow$ **0 rớt**.
- Từ laptop: `bash ~/tai-nguyen/scripts/quet-cong.sh 72.155.73.216` $\rightarrow$ Chỉ cổng 22 và 80 **MỞ**, cổng 3306 **IM LẶNG**.

## 2. Lần sau: đưa bản mới lên

Bước 1 với tag **mới** (ví dụ `v2`, không đè tag cũ) $\rightarrow$ trên máy chủ `sed -i 's/^IMAGE_TAG=.*/IMAGE_TAG=v2/' .env` $\rightarrow$ lặp lại bước 5, 6, 7, 8.

## 3. Gỡ sự cố 5 bước

```bash
curl -I http://localhost/health                         # 1. Triệu chứng chính xác? (mã 200, 502, treo?)
docker compose -f compose.prod.yml ps                   # 2. Cái gì đang chạy? (Exit? Restarting?)
docker compose -f compose.prod.yml logs --tail 50 app   # 3. Nó nói gì? (hoặc db / proxy)
df -h ; free -h                                         # 4. Máy còn dung lượng đĩa và RAM/Swap không?
                                                        # 5. Gần đây đổi gì? Sửa duy nhất MỘT thứ rồi test lại
```

## 4. Sự cố đã gặp

| Ngày | Triệu chứng | Nguyên nhân | Cách xử lý | Ai |
|---|---|---|---|---|
| 26/10/2026 | `docker push` báo `denied` ở manifest | Dockerfile có nhãn `LABEL source=ten-github` không thuộc quyền sở hữu | Xóa/sửa nhãn trong Dockerfile thành `tranvu2006-ui` rồi build và push lại | Nhóm |
| 26/10/2026 | `docker compose pull` báo `502 Bad Gateway` cho image `caddy:2` | Mạng Docker Hub bị nghẽn tạm thời trong 1 giây | Chạy lại lệnh pull lần 2 là thành công | Nhóm |

## 5. Hai con số của nhóm

| Con số | Buổi 13 | Buổi 15 | Buổi 18 | Buổi 21 |
|---|---|---|---|---|
| Từ lúc có code mới đến lúc chạy trên máy chủ (phút) | **12 phút** | | | |
| Web hỏng, khôi phục mất (phút) | — | | | |
