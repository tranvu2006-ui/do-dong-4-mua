#!/usr/bin/env bash
# =====================================================================================
# backup.sh — BACKUP TỰ ĐỘNG (buổi 14). Đặt ở /opt/app/backup.sh, chạy bằng user sv.
#
# Backup đúng 3 thứ:
#   1. Dữ liệu CSDL      → db.sql.gz       (lệnh dump chạy TRONG hộp CSDL, rồi nén)
#   2. File người dùng   → uploads.tar.gz  (nén nguyên volume upload)
#   3. .env máy chủ      → KHÔNG ở đây. Giữ một bản trên laptop (keo-backup.sh kéo về). Lý do: thư mục
#                          backup có thể được đẩy lên Drive (NÊN, rclone) — .env thì không bao giờ.
#
# Chạy tay:   /opt/app/backup.sh
# Đặt lịch:   crontab -e  rồi thêm dòng
#             0 2 * * * /opt/app/backup.sh >> /opt/app/backup.log 2>&1
# Mã thoát:   0 = thành công; khác 0 = hỏng (cron vẫn ghi lý do vào backup.log)
# =====================================================================================

# Dừng ngay khi có lệnh lỗi (-e), biến chưa đặt (-u), lỗi giữa ống nối | (pipefail).
# Không có pipefail: "dump lỗi | gzip" vẫn "thành công" và để lại một file nén RỖNG — kiểu backup hỏng hay gặp nhất.
set -euo pipefail

# ---------------- ĐIỀN cho dự án của em (<<< SỬA) ------------------------------------
# Thư mục triển khai (có compose.prod.yml, .env)
THU_MUC_APP=/opt/app
# Tên DỊCH VỤ CSDL trong compose.prod.yml
DICH_VU_DB=db
# Tên volume chứa file upload, ĐÚNG như trong compose.prod.yml (không cần tiền tố tên dự án).
# Dự án không có upload: để trống  VOLUME_UPLOAD=""
VOLUME_UPLOAD=uploads
# Giữ bao nhiêu ngày trên VPS. Không xoá bản cũ = một ngày nào đó đĩa đầy
GIU_NGAY=7
# --------------------------------------------------------------------------------------

# Image nhỏ chỉ dùng để chạy lệnh tar trên volume (không phải image của app)
IMAGE_TAR=${IMAGE_TAR:-busybox:1.37}
# Mọi file tạo ra chỉ chủ sở hữu đọc được: backup chứa email, mật khẩu đã băm của người dùng
umask 077

ghi() { echo "$(date '+%F %T') $*"; }
DICH=""
# Hỏng ở bất kỳ đâu: đổi tên thư mục thành ..._HONG để không ai nhầm nó là bản dùng được
danh_dau_hong() { [ -n "$DICH" ] && [ -d "$DICH" ] && mv "$DICH" "${DICH}_HONG"; }
hong() { ghi "LỖI: $*"; danh_dau_hong; exit 1; }
trap 'ghi "LỖI: lệnh ở dòng $LINENO thất bại"; danh_dau_hong' ERR

# cron chạy với thư mục và PATH tối thiểu: tự đi vào đúng thư mục
cd "$THU_MUC_APP" || hong "không vào được $THU_MUC_APP"
COMPOSE="docker compose -f compose.prod.yml"

# Mỗi lần chạy một thư mục MỚI theo ngày giờ đến từng giây, ví dụ backups/2026-11-02_02000101.
# mkdir không có -p: thư mục đã tồn tại thì dừng, không bao giờ ghi đè (hay đổi tên) một bản cũ.
LAN_NAY=$(date +%F_%H%M%S)
mkdir -p "$THU_MUC_APP/backups"
mkdir "$THU_MUC_APP/backups/$LAN_NAY" || { ghi "LỖI: $LAN_NAY đã tồn tại"; exit 1; }
DICH="$THU_MUC_APP/backups/$LAN_NAY"
ghi "BẮT ĐẦU backup → $DICH"

# ---- 1. CSDL -------------------------------------------------------------------------
# Hộp CSDL phải đang chạy (dump đọc dữ liệu từ MySQL đang sống, không chép file thô)
CID=$($COMPOSE ps -q "$DICH_VU_DB")
[ -n "$CID" ] || hong "dịch vụ '$DICH_VU_DB' không chạy — '$COMPOSE ps' để xem"
ANH=$(docker inspect -f '{{.Config.Image}}' "$CID")

case "$ANH" in
  *mysql*|*mariadb*)
    # Mật khẩu lấy từ biến môi trường SẴN CÓ trong hộp CSDL (MYSQL_ROOT_PASSWORD): script không chứa bí mật nào.
    # MYSQL_PWD thay cho -p...: mật khẩu không hiện trong danh sách tiến trình, không in cảnh báo.
    # --single-transaction: chụp nhất quán mà không khoá bảng (web vẫn chạy trong lúc backup)
    # --databases: file dump có sẵn CREATE DATABASE + USE → buổi 15 khôi phục chỉ cần một lệnh
    $COMPOSE exec -T "$DICH_VU_DB" sh -c 'MYSQL_PWD="$MYSQL_ROOT_PASSWORD" exec mysqldump -uroot \
        --single-transaction --routines --triggers --no-tablespaces --databases "$MYSQL_DATABASE"' \
      | gzip > "$DICH/db.sql.gz" ;;
  *postgres*)
    # PostgreSQL: pg_dump với user/CSDL lấy từ biến môi trường của hộp
    $COMPOSE exec -T "$DICH_VU_DB" sh -c 'exec pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists' \
      | gzip > "$DICH/db.sql.gz" ;;
  *) hong "không nhận ra loại CSDL từ image '$ANH' — sửa phần case trong script" ;;
esac

# Kiểm ngay: file nén đọc được, và bên trong thật sự có lệnh tạo bảng
gzip -t "$DICH/db.sql.gz" || hong "db.sql.gz hỏng"
SO_BANG=$(gzip -dc "$DICH/db.sql.gz" | grep -c '^CREATE TABLE' || true)
[ "$SO_BANG" -gt 0 ] || hong "db.sql.gz không có bảng nào (CSDL rỗng? chưa migrate?)"
ghi "CSDL: $SO_BANG bảng, $(du -h "$DICH/db.sql.gz" | cut -f1)"

# ---- 2. File upload ------------------------------------------------------------------
if [ -n "$VOLUME_UPLOAD" ]; then
  # Tên thật của volume = <tên dự án>_<tên trong compose>, ví dụ goc-do-cu_uploads
  DU_AN=$($COMPOSE config 2>/dev/null | sed -n 's/^name: //p' | head -1)
  VOL="${DU_AN}_${VOLUME_UPLOAD}"
  docker volume inspect "$VOL" >/dev/null 2>&1 || hong "không thấy volume $VOL — kiểm VOLUME_UPLOAD"
  # Gắn volume vào một hộp tạm CHỈ-ĐỌC (:ro) rồi nén ra ngoài. Không đụng tới hộp app đang chạy.
  docker run --rm -v "$VOL":/du-lieu:ro "$IMAGE_TAR" tar czf - -C /du-lieu . > "$DICH/uploads.tar.gz"
  gzip -t "$DICH/uploads.tar.gz" || hong "uploads.tar.gz hỏng"
  SO_FILE=$(tar tzf "$DICH/uploads.tar.gz" | grep -vc '/$' || true)
  ghi "Upload: $SO_FILE file, $(du -h "$DICH/uploads.tar.gz" | cut -f1)"
fi

# ---- 3. Dọn bản cũ + đánh dấu thành công ---------------------------------------------
# Xoá các thư mục backup cũ hơn GIU_NGAY ngày
find "$THU_MUC_APP/backups" -mindepth 1 -maxdepth 1 -type d -mtime +"$GIU_NGAY" -print -exec rm -rf {} + \
  | sed 's/^/  đã xoá bản cũ: /'
# Dấu thời gian của lần thành công gần nhất (buổi 19 dùng để cảnh báo khi backup ngừng chạy)
date '+%F %T' > "$THU_MUC_APP/backups/.lan-cuoi-thanh-cong"
ghi "XONG. Trên VPS đang có $(find "$THU_MUC_APP/backups" -mindepth 1 -maxdepth 1 -type d | wc -l) bản, dùng $(du -sh "$THU_MUC_APP/backups" | cut -f1). Nhớ kéo về laptop: make backup-pull"
