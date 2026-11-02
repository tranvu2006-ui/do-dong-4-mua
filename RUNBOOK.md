# RUNBOOK — Đổ Đống 4 Mùa / Góc Đồ Cũ (Nhóm: Trần Vũ & Hồ Thị Vân Anh)

> Runbook là tài liệu người trực mở ra **lúc 2 giờ sáng khi web sập**: không giải thích lý thuyết, chỉ có
> *làm gì — gõ gì — đúng khi thấy gì*. Người đọc: một bạn trong lớp biết `ssh` và Docker nhưng **chưa từng thấy
> dự án này**, không hỏi được ai. Viết bằng lời của nhóm. **Không** ghi mật khẩu, token — chỉ ghi *chúng nằm ở đâu*.
>
> Bản nháp buổi 14: mục 0–4. Buổi 15 thêm mục 5 (KHÔI PHỤC) sau khi tự diễn tập.

Cập nhật lần cuối: 27/10/2026 — người cập nhật: Trần Vũ (24211TT2515) & Hồ Thị Vân Anh (24211TT3786)

## 0. Thông tin nhanh

| Mục | Chi tiết |
|---|---|
| URL | `https://dodongbonmua.duckdns.org` |
| Máy chủ | Azure, `Standard_B2ats_v2`, Ubuntu 22.04 LTS, IP `72.155.73.216`, vùng `Korea Central` |
| Vào máy | `ssh may-chu` (bí danh trong `~/.ssh/config`, khoá `~/.ssh/id_ed25519`) — **chỉ khoá**, mật khẩu bị từ chối |
| Lối thoát khi mất SSH | Portal Azure → máy ảo `DevOps` → **Help → Serial console** (user `sv`) |
| Thư mục | `/opt/app` (liên kết đến `/opt/goc-do-cu`) — gồm `compose.prod.yml`, `Caddyfile`, `.env`, `backup.sh`, `backups/` |
| Bản đang chạy | `grep IMAGE_TAG /opt/app/.env` (hiện tại: `v1`) |
| Bí mật nằm ở đâu | Mật khẩu quản trị app, token ghcr (đọc), token DuckDNS: quản lý an toàn nội bộ nhóm. Bản `.env` máy chủ: laptop tại `~/backup-may-chu/env-may-chu` |
| Ai trực | Trần Vũ (chính), Hồ Thị Vân Anh (phụ) |

Mọi lệnh `docker compose` trên máy chủ đều chạy trong `/opt/app` và **luôn có** `-f compose.prod.yml`.
Viết tắt bên dưới: `DC` = `docker compose -f compose.prod.yml`.

**Ba điều KHÔNG BAO GIỜ làm trên máy chủ**
1. `DC down -v` hay `docker volume rm/prune` — mất CSDL, ảnh upload, và chứng chỉ HTTPS (bị Let's Encrypt khoá cấp lại nhiều ngày).
2. Chạy seed / `make docker-setup` — xoá dữ liệu thật, tạo tài khoản mật khẩu `123456`.
3. Xoá rồi tạo lại `.env` — mật khẩu CSDL mới không khớp CSDL cũ đang lưu trong volume.

## 1. Web không vào được — gỡ sự cố 5 bước

Đi **đúng thứ tự**, chưa xong bước 1–4 thì chưa sửa gì. Mỗi bước ghi lại em thấy gì.

| # | Lệnh | Bình thường trông thế này (đo ngày 27/10/2026) |
|---|---|---|
| 1 | Laptop: `curl -I https://dodongbonmua.duckdns.org/health` | `HTTP/2 200` (`{"status":"ok"}`) |
| 2 | `DC ps` | 3 dịch vụ `Up`, db `(healthy)`, chỉ proxy có cổng `80->80`, `443->443` |
| 3 | `DC logs --tail 50 <dịch vụ>` | `proxy`: certificate obtained successfully, `app`: listening on :8080, `db`: ready for connections |
| 4 | `df -h /` và `free -h` | Đĩa sử dụng ~16% (còn trống > 24GB), RAM dùng ~700MB / 1.9GB, Swap 2.0GB (used 0B) |
| 5 | Gần đây đổi gì? `grep IMAGE_TAG .env`, `ls -lt /opt/app`, `tail backup.log` | → sửa **một** thứ, quay lại bước 1 |

Đọc triệu chứng ở bước 1:

| curl báo | Thường là | Nhìn tiếp |
|---|---|---|
| `Could not resolve host` | DNS | `nslookup dodongbonmua.duckdns.org 1.1.1.1` — DuckDNS còn trỏ đúng IP `72.155.73.216`? |
| `timed out` | Tường lửa vứt gói tin / máy tắt | Portal Azure: máy *Running*? NSG còn 80/443? `sudo ufw status` |
| `Could not connect` (ngay lập tức) | Tới máy nhưng proxy không nghe | `DC ps` — proxy chạy chưa, có `443:443` chưa |
| `SSL certificate problem` / curl mã 60 | Chứng chỉ | `DC logs proxy \| grep -i -E 'error\|obtain'` |
| `502` | Proxy chạy, app chết | `DC logs --tail 50 app` |
| `500` | App chạy, lỗi bên trong (thường là CSDL) | `DC logs app`, `DC ps db` |

## 2. Deploy bản mới

Chi tiết từng bước và thời gian: `DEPLOY.md`. Tóm tắt khi cập nhật lên tag mới:

```bash
# laptop: build + push tag MỚI (không bao giờ đè tag cũ)
docker build --platform linux/amd64 -t ghcr.io/tranvu2006-ui/goc-do-cu:vN . && docker push ghcr.io/tranvu2006-ui/goc-do-cu:vN
# laptop: backup + kéo về TRƯỚC khi cập nhật (bản mới có thể đổi bảng)
make backup-now
# máy chủ
cd /opt/app
grep IMAGE_TAG .env                               # ghi lại bản đang chạy: v1
sed -i 's/^IMAGE_TAG=.*/IMAGE_TAG=vN/' .env
DC pull app
DC run --rm app php bin/migrate.php
DC up -d
curl -I https://dodongbonmua.duckdns.org/health   # đúng khi: HTTP/2 200
```

**Quay lui:** đổi `IMAGE_TAG` về bản cũ (`v1`), `DC up -d`. Nếu bản mới đã chạy migration đổi/xoá cột → quay tag không đủ, phải khôi phục CSDL từ bản backup vừa làm (mục 5).

## 3. Xem log

| Muốn xem | Lệnh |
|---|---|
| Log app, 50 dòng cuối | `DC logs --tail 50 app` |
| Theo dõi trực tiếp | `DC logs -f app` (Ctrl+C để thoát) |
| Chỉ lỗi | `DC logs app 2>&1 \| grep -i -E 'error\|fatal\|exception'` |
| Chứng chỉ HTTPS | `DC logs proxy \| grep -i -E 'obtain\|challenge\|error'` |
| CSDL | `DC logs --tail 50 db` |
| Backup | `tail -20 /opt/app/backup.log` |
| Ai đang dò SSH | `sudo grep -c 'Invalid user' /var/log/auth.log` |

## 4. Backup

| Mục | Chi tiết |
|---|---|
| Backup gì | CSDL (`db.sql.gz`), ảnh upload (`uploads.tar.gz`). `.env` giữ riêng trên laptop (`env-may-chu`) |
| Lúc nào | Mỗi ngày **02:00 giờ Việt Nam** (`crontab -l`; máy đã `timedatectl` = `Asia/Ho_Chi_Minh`) |
| Ở đâu trên VPS | `/opt/app/backups/<ngày>_<giờ>/`, giữ **7 ngày** |
| Ngoài VPS | Laptop: `~/backup-may-chu/` — kéo bằng `make backup-pull` **mỗi Chủ nhật** và trước mỗi lần deploy |
| (NÊN) Google Drive | rclone → `gdrive:backup-goc-do-cu/` (chỉ thư mục backup, **không** có `.env`) |

Kiểm tra backup còn sống (làm mỗi tuần, 1 phút):

```bash
tail -5 /opt/app/backup.log                         # dòng cuối: "XONG", ngày hôm nay
cat /opt/app/backups/.lan-cuoi-thanh-cong           # < 24 giờ trước
ls /opt/app/backups/                                # các thư mục theo ngày giờ, không có _HONG mới
find /opt/app/backups -name '*.gz' -size -100c      # phải KHÔNG in ra gì (file < 100 byte = rỗng)
```

Backup ngay, bằng tay: `/opt/app/backup.sh` (hoặc từ laptop `make backup-now`).
Thấy thư mục `..._HONG`: đọc `backup.log` cùng giờ đó để biết lý do; bản này **không** dùng để khôi phục.

## 5. KHÔI PHỤC — viết ở buổi 15

> Để trống. Buổi 15 nhóm tự khôi phục thử trên máy local, rồi viết mục này: từng lệnh, thời gian từng bước,
> "đúng khi…". Người gõ lệnh lúc thi (QT3 phần B) là người **không** viết mục này.

- Mục tiêu: mất tối đa 24 giờ dữ liệu; web sập tối đa 30 phút.

