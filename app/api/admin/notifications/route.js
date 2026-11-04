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
      sender_id BIGINT UNSIGNED NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_recipient (recipient_type),
      INDEX idx_created (created_at),
      CONSTRAINT fk_notifications_sender FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
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
      sql += ` AND (n.title LIKE ? OR n.content LIKE ?)`;
      const term = `%${search.trim()}%`;
      params.push(term, term);
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
    const { title, content, recipient_type = 'ALL', sender_id = 1 } = body;

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

    const validRecipients = ['ALL', 'CUSTOMERS', 'ADMINS'];
    const finalRecipient = validRecipients.includes(recipient_type) ? recipient_type : 'ALL';

    const result = await query(
      `INSERT INTO notifications (title, content, recipient_type, sender_id, created_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [title.trim(), content.trim(), finalRecipient, sender_id || 1]
    );

    const recipientLabelMap = {
      ALL: 'Tất cả (Khách hàng & Quản trị viên)',
      CUSTOMERS: 'Khách hàng',
      ADMINS: 'Quản trị viên chi nhánh'
    };
    const recipientLabel = recipientLabelMap[finalRecipient] || finalRecipient;

    // Log action to system_logs with real IP and natural language (FR-045)
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

