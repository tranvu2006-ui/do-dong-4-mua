import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { logSystemAction } from '@/lib/logger';

async function ensureNotificationsTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS notifications (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      recipient_type VARCHAR(50) NOT NULL DEFAULT 'ALL',
      recipient_ids TEXT NULL,
      recipient_names TEXT NULL,
      sender_id BIGINT UNSIGNED NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_recipient (recipient_type),
      INDEX idx_created (created_at),
      CONSTRAINT fk_notifications_sender FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  try {
    const cols = await query("DESCRIBE notifications");
    const colNames = cols.map((c) => c.Field);
    if (!colNames.includes('recipient_ids')) {
      await query("ALTER TABLE notifications ADD COLUMN recipient_ids TEXT NULL AFTER recipient_type");
    }
    if (!colNames.includes('recipient_names')) {
      await query("ALTER TABLE notifications ADD COLUMN recipient_names TEXT NULL AFTER recipient_ids");
    }
  } catch (e) {
    // Already exists
  }
}

export async function GET(request) {
  try {
    await ensureNotificationsTable();
    const { searchParams } = new URL(request.url);
    const recipient_type = searchParams.get('recipient_type');
    const search = searchParams.get('search');

    let sql = `
      SELECT n.*, u.full_name AS sender_name, u.phone AS sender_phone
      FROM notifications n
      LEFT JOIN users u ON n.sender_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (recipient_type && recipient_type !== 'ALL_FILTER') {
      sql += ` AND n.recipient_type = ?`;
      params.push(recipient_type);
    }

    if (search && search.trim() !== '') {
      sql += ` AND (n.title LIKE ? OR n.content LIKE ? OR n.recipient_names LIKE ?)`;
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    sql += ` ORDER BY n.created_at DESC, n.id DESC`;

    const notifications = await query(sql, params);
    return NextResponse.json({ success: true, data: notifications });
  } catch (error) {
    console.error('Error fetching admin notifications (FR-046):', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await ensureNotificationsTable();
    const body = await request.json();
    const {
      title,
      content,
      recipient_type = 'ALL',
      recipient_ids = [],
      sender_id = 1
    } = body;

    if (!title || title.trim() === '') {
      return NextResponse.json(
        { success: false, message: 'Vui lòng nhập tiêu đề thông báo!' },
        { status: 400 }
      );
    }

    if (!content || content.trim() === '') {
      return NextResponse.json(
        { success: false, message: 'Vui lòng nhập nội dung thông báo!' },
        { status: 400 }
      );
    }

    const validRecipients = ['ALL', 'CUSTOMERS', 'ADMINS', 'SPECIFIC'];
    const finalRecipient = validRecipients.includes(recipient_type) ? recipient_type : 'ALL';

    let storedRecipientIds = null;
    let storedRecipientNames = null;
    let recipientLabel = 'Toàn hệ thống (Khách hàng & Quản trị viên)';

    if (finalRecipient === 'SPECIFIC') {
      if (!Array.isArray(recipient_ids) || recipient_ids.length === 0) {
        return NextResponse.json(
          { success: false, message: 'Vui lòng chọn ít nhất 1 người nhận cụ thể!' },
          { status: 400 }
        );
      }

      // Query names of selected users
      const placeholders = recipient_ids.map(() => '?').join(',');
      const selectedUsers = await query(
        `SELECT id, full_name, phone FROM users WHERE id IN (${placeholders})`,
        recipient_ids
      );

      const nameList = selectedUsers.map((u) => `${u.full_name} (${u.phone})`);
      storedRecipientIds = JSON.stringify(recipient_ids);
      storedRecipientNames = nameList.join(', ');
      recipientLabel = `Đích danh ${recipient_ids.length} người nhận: ${storedRecipientNames}`;
    } else if (finalRecipient === 'CUSTOMERS') {
      recipientLabel = 'Khách hàng';
    } else if (finalRecipient === 'ADMINS') {
      recipientLabel = 'Quản trị viên chi nhánh';
    }

    const result = await query(
      `INSERT INTO notifications (title, content, recipient_type, recipient_ids, recipient_names, sender_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [
        title.trim(),
        content.trim(),
        finalRecipient,
        storedRecipientIds,
        storedRecipientNames,
        sender_id || 1
      ]
    );

    // Ghi nhật ký hệ thống kiểm toán (FR-045 & BR-030)
    await logSystemAction({
      request,
      userId: sender_id || 1,
      action: 'CREATE_NOTIFICATION',
      module: 'NOTIFICATION',
      description: `Gửi thông báo mới: "${title.trim()}" đến đối tượng: ${recipientLabel}`
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Gửi thông báo thành công!',
        data: {
          id: result.insertId,
          title: title.trim(),
          content: content.trim(),
          recipient_type: finalRecipient,
          recipient_ids: storedRecipientIds,
          recipient_names: storedRecipientNames,
          sender_id: sender_id || 1,
          created_at: new Date().toISOString()
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating notification (FR-046):', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await ensureNotificationsTable();
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Thiếu ID thông báo cần xóa!' }, { status: 400 });
    }

    const [existing] = await query(`SELECT title FROM notifications WHERE id = ?`, [id]);
    const notifTitle = existing?.title || `#${id}`;

    await query(`DELETE FROM notifications WHERE id = ?`, [id]);

    await logSystemAction({
      request,
      userId: 1,
      action: 'DELETE_NOTIFICATION',
      module: 'NOTIFICATION',
      description: `Xóa thông báo: "${notifTitle}"`
    });

    return NextResponse.json({ success: true, message: 'Đã xóa thông báo thành công!' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
